import httpx
from io import BytesIO
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from typing import Optional
from PIL import Image

from app.models import (
    ExtractRequest, ExtractResponse, RemixRequest, RemixResponse,
    BlendRequest, BlendResponse, PresetRequest, PresetResponse,
    ExportRequest, ExportFormat, PresetInfo, CinematographyDNA,
    generate_seed
)
from app.services.fibo import FIBOClient, blend_dna
from app.services.presets import load_preset, list_presets, apply_preset

router = APIRouter()


async def upload_to_temp(file: UploadFile) -> str:
    """Convert uploaded file to data URI for FIBO API"""
    content = await file.read()
    import base64
    b64 = base64.b64encode(content).decode()
    mime = file.content_type or "image/jpeg"
    return f"data:{mime};base64,{b64}"


@router.post("/extract", response_model=ExtractResponse)
async def extract_dna(
    image: Optional[UploadFile] = File(None),
    image_url: Optional[str] = Form(None)
):
    """
    Extract cinematographic DNA from an image.
    Returns DNA, seed, and source image URL needed for consistent remixing.
    """
    if not image and not image_url:
        raise HTTPException(400, "Provide either image file or image_url")

    url = image_url
    if image:
        url = await upload_to_temp(image)

    # Generate a seed for this extraction session
    seed = generate_seed()

    client = FIBOClient()
    try:
        response = await client.inspire(url, seed)
        dna, description, confidence, structured_prompt = client.parse_inspire_response(response)

        return ExtractResponse(
            dna=dna,
            source_description=description,
            confidence=confidence,
            # CRITICAL: Return context needed for consistent remix
            source_image_url=url,
            seed=seed,
            structured_prompt=structured_prompt
        )
    except httpx.HTTPStatusError as e:
        raise HTTPException(e.response.status_code, f"FIBO API error: {e.response.text}")


@router.post("/remix", response_model=RemixResponse)
async def remix_image(request: RemixRequest):
    """
    Remix an image by modifying specific DNA parameters.
    Uses the original image as reference to maintain scene consistency.
    """
    client = FIBOClient()
    try:
        # Apply modifications to DNA
        modified_dna_dict = request.base_dna.model_dump()
        for key, value in request.modifications.items():
            parts = key.split(".")
            if len(parts) == 2 and parts[0] in modified_dna_dict:
                modified_dna_dict[parts[0]][parts[1]] = value
            elif key in modified_dna_dict:
                modified_dna_dict[key] = value

        modified_dna = CinematographyDNA(**modified_dna_dict)

        # CRITICAL: Use refine with original image reference and same seed
        response = await client.refine(
            source_image_url=request.source_image_url,
            modified_dna=modified_dna,
            modifications=request.modifications,
            seed=request.seed,
            original_structured_prompt=request.original_structured_prompt
        )

        image_data = response.get("image", {})
        image_url = image_data.get("url", "") if isinstance(image_data, dict) else ""

        return RemixResponse(
            image_url=image_url,
            modified_dna=modified_dna,
            generation_metadata={
                "model": response.get("model", "fibo"),
                "seed": request.seed,
                "steps": response.get("steps"),
                "duration_ms": response.get("duration_ms"),
                "modifications": request.modifications
            },
            seed=request.seed
        )
    except httpx.HTTPStatusError as e:
        raise HTTPException(e.response.status_code, f"FIBO API error: {e.response.text}")


@router.post("/blend", response_model=BlendResponse)
async def blend_styles(request: BlendRequest):
    """Blend the cinematographic styles of two DNA profiles"""
    blended = blend_dna(request.dna_a, request.dna_b, request.ratio)

    client = FIBOClient()
    try:
        response = await client.generate(blended, request.prompt)
        image_data = response.get("image", {})
        image_url = image_data.get("url", "") if isinstance(image_data, dict) else ""

        return BlendResponse(
            image_url=image_url,
            blended_dna=blended,
            ratio=request.ratio
        )
    except httpx.HTTPStatusError as e:
        raise HTTPException(e.response.status_code, f"FIBO API error: {e.response.text}")


@router.post("/preset", response_model=PresetResponse)
async def apply_style_preset(
    image: Optional[UploadFile] = File(None),
    image_url: Optional[str] = Form(None),
    preset_name: str = Form(...)
):
    """Apply a director preset to an image while maintaining scene consistency"""
    if not image and not image_url:
        raise HTTPException(400, "Provide either image file or image_url")

    preset = load_preset(preset_name)
    if not preset:
        raise HTTPException(404, f"Preset '{preset_name}' not found")

    url = image_url
    if image:
        url = await upload_to_temp(image)

    # Generate seed for consistency
    seed = generate_seed()

    client = FIBOClient()
    try:
        # Extract DNA and structured prompt from original image
        inspire_response = await client.inspire(url, seed)
        original_dna, _, _, structured_prompt = client.parse_inspire_response(inspire_response)

        # Apply preset to get styled DNA
        styled_dna = apply_preset(original_dna, preset)

        # Build modifications dict from preset overrides for the refine instruction
        # This tells FIBO exactly what style parameters to change
        modifications = {}
        overrides = preset.get("overrides", {})
        for category, params in overrides.items():
            for key, value in params.items():
                modifications[f"{category}.{key}"] = value

        # CRITICAL: Use refine() with original image reference and same seed
        # This maintains scene consistency while applying style changes
        refine_response = await client.refine(
            source_image_url=url,
            modified_dna=styled_dna,
            modifications=modifications,
            seed=seed,
            original_structured_prompt=structured_prompt
        )
        image_data = refine_response.get("image", {})
        result_image_url = image_data.get("url", "") if isinstance(image_data, dict) else ""

        return PresetResponse(
            image_url=result_image_url,
            applied_preset=preset_name,
            original_dna=original_dna,
            styled_dna=styled_dna,
            source_image_url=url,
            seed=seed
        )
    except httpx.HTTPStatusError as e:
        raise HTTPException(e.response.status_code, f"FIBO API error: {e.response.text}")


@router.get("/presets", response_model=list[PresetInfo])
async def get_presets():
    """List all available director presets"""
    return list_presets()


@router.post("/export")
async def export_image(request: ExportRequest):
    """Export an image in various professional formats"""
    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.get(str(request.image_url))
        response.raise_for_status()

    img = Image.open(BytesIO(response.content))

    output = BytesIO()
    filename = "cinemorph_export"

    if request.format == ExportFormat.TIFF:
        if img.mode != "RGB":
            img = img.convert("RGB")
        img.save(output, format="TIFF", compression="none")
        media_type = "image/tiff"
        filename += ".tiff"
    elif request.format == ExportFormat.PNG:
        img.save(output, format="PNG", optimize=True)
        media_type = "image/png"
        filename += ".png"
    else:
        if img.mode == "RGBA":
            img = img.convert("RGB")
        img.save(output, format="JPEG", quality=request.quality)
        media_type = "image/jpeg"
        filename += ".jpg"

    output.seek(0)
    return StreamingResponse(
        output,
        media_type=media_type,
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
