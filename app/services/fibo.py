import httpx
from typing import Optional
from app.config import get_settings
from app.models import CinematographyDNA, CameraParams, LightingParams, ColorParams, CompositionParams, AtmosphereParams


class FIBOClient:
    def __init__(self):
        self.settings = get_settings()
        self.base_url = "https://fal.run/bria/fibo/generate"
        self.headers = {
            "Authorization": f"Key {self.settings.fal_api_key}",
            "Content-Type": "application/json"
        }

    async def inspire(self, image_url: str, seed: Optional[int] = None) -> dict:
        """Extract structured prompt from an image (Inspire mode)"""
        payload = {
            "image_url": image_url,
            "prompt": "Analyze this image and extract its cinematographic DNA",
            "sync_mode": True
        }
        if seed is not None:
            payload["seed"] = seed

        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                self.base_url,
                headers=self.headers,
                json=payload
            )
            response.raise_for_status()
            return response.json()

    async def refine(
        self,
        source_image_url: str,
        modified_dna: CinematographyDNA,
        modifications: dict,
        seed: int,
        original_structured_prompt: Optional[dict] = None
    ) -> dict:
        """
        Refine an image using the original as reference.
        This maintains scene consistency by using image-to-image generation.
        """
        # Build a modification instruction describing what changed
        modification_instruction = self._build_modification_instruction(modifications)

        # Build the full prompt with the modified DNA
        base_prompt = self._dna_to_prompt(modified_dna)

        # Combine: describe what to change + full scene description
        full_prompt = f"{modification_instruction}. {base_prompt}"

        payload = {
            "image_url": source_image_url,  # CRITICAL: Use original image as reference
            "prompt": full_prompt,
            "seed": seed,  # CRITICAL: Same seed for consistency
            "sync_mode": True,
            # Use image guidance strength to maintain scene consistency
            # Higher value = more similar to original
            "image_guidance_scale": 1.5,
        }

        # If we have the original structured prompt, include it for better context
        if original_structured_prompt:
            payload["structured_prompt"] = original_structured_prompt

        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                self.base_url,
                headers=self.headers,
                json=payload
            )
            response.raise_for_status()
            return response.json()

    def _build_modification_instruction(self, modifications: dict) -> str:
        """Build a natural language instruction for the modifications"""
        if not modifications:
            return "Maintain the exact same scene"

        changes = []
        for key, value in modifications.items():
            # Parse the key (e.g., "lighting.time_of_day" -> "lighting time of day")
            readable_key = key.replace(".", " ").replace("_", " ")
            # Format the value
            if isinstance(value, str):
                readable_value = value.replace("_", " ")
            else:
                readable_value = str(value)
            changes.append(f"change {readable_key} to {readable_value}")

        return "Keep the same scene and subjects, but " + ", ".join(changes)

    async def generate(self, dna: CinematographyDNA, prompt: Optional[str] = None, seed: Optional[int] = None) -> dict:
        """Generate image from DNA parameters (for blend mode)"""
        base_prompt = self._dna_to_prompt(dna)
        full_prompt = f"{prompt}. {base_prompt}" if prompt else base_prompt

        payload = {
            "prompt": full_prompt,
            "sync_mode": True
        }
        if seed is not None:
            payload["seed"] = seed

        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                self.base_url,
                headers=self.headers,
                json=payload
            )
            response.raise_for_status()
            return response.json()

    async def generate_with_reference(
        self,
        source_image_url: str,
        dna: CinematographyDNA,
        seed: int,
        prompt: Optional[str] = None
    ) -> dict:
        """Generate image with original as reference (for preset mode)"""
        base_prompt = self._dna_to_prompt(dna)
        full_prompt = f"{prompt}. {base_prompt}" if prompt else base_prompt

        payload = {
            "image_url": source_image_url,
            "prompt": full_prompt,
            "seed": seed,
            "sync_mode": True,
            "image_guidance_scale": 1.5,
        }

        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                self.base_url,
                headers=self.headers,
                json=payload
            )
            response.raise_for_status()
            return response.json()

    def _dna_to_prompt(self, dna: CinematographyDNA, modifications: dict = None) -> str:
        """Convert DNA to a descriptive prompt for FIBO"""
        palette = ", ".join(dna.color.palette) if dna.color.palette else "neutral"

        parts = [
            f"A cinematic {dna.camera.shot_type} shot",
            f"camera angle: {dna.camera.angle}",
            f"focal length: {dna.camera.lens_mm}mm",
            f"depth of field: {dna.camera.depth_of_field}",
            f"lighting: {dna.lighting.style} {dna.lighting.direction} light",
            f"time of day: {dna.lighting.time_of_day}",
            f"color palette: {palette}",
            f"mood: {dna.color.mood}",
            f"color grade: {dna.color.grade}",
            f"environment: {dna.atmosphere.environment}",
            f"weather: {dna.atmosphere.weather}",
        ]

        if modifications:
            mod_parts = [f"{k}: {v}" for k, v in modifications.items()]
            parts.append(f"with modifications: {', '.join(mod_parts)}")

        return ". ".join(parts)

    def _dna_to_structured_prompt(self, dna: CinematographyDNA) -> dict:
        """Convert our DNA format to FIBO's structured_prompt format"""
        palette_str = ", ".join(dna.color.palette) if dna.color.palette else "neutral tones"

        return {
            "short_description": f"A {dna.camera.shot_type} shot with {dna.lighting.style} lighting in {dna.atmosphere.environment} setting",
            "lighting": {
                "conditions": f"{dna.lighting.style} lighting, {dna.lighting.time_of_day}, intensity {dna.lighting.intensity}, {dna.lighting.color_temp}K",
                "direction": dna.lighting.direction,
                "shadows": "soft" if dna.lighting.intensity < 0.5 else "defined"
            },
            "photographic_characteristics": {
                "camera_angle": dna.camera.angle,
                "lens_focal_length": f"{dna.camera.lens_mm}mm",
                "depth_of_field": dna.camera.depth_of_field,
                "focus": dna.camera.shot_type
            },
            "aesthetics": {
                "composition": f"{dna.composition.framing} framing, symmetry {dna.composition.symmetry}",
                "color_scheme": f"{palette_str}, saturation {dna.color.saturation}, contrast {dna.color.contrast}, {dna.color.grade} grade",
                "mood_atmosphere": dna.color.mood
            },
            "background_setting": f"{dna.atmosphere.environment} environment, {dna.atmosphere.weather} weather, haze {dna.atmosphere.haze}, {dna.atmosphere.particles} particles",
            "context": f"{dna.camera.shot_type} shot, {dna.composition.framing} composition",
            "style_medium": dna.color.grade
        }

    def parse_inspire_response(self, response: dict) -> tuple[CinematographyDNA, str, float, dict]:
        """Parse FIBO's response and extract DNA from structured_prompt
        Returns: (dna, description, confidence, raw_structured_prompt)
        """
        structured = response.get("structured_prompt", {})
        description = response.get("prompt", "") or structured.get("short_description", "")

        def safe_dict(val):
            return val if isinstance(val, dict) else {}

        photo = safe_dict(structured.get("photographic_characteristics"))
        light = safe_dict(structured.get("lighting"))
        aes = safe_dict(structured.get("aesthetics"))
        bg = structured.get("background_setting", "")
        ctx = structured.get("context", "")

        # Handle bg and ctx as strings or dicts
        if isinstance(bg, str):
            bg = {"raw": bg}
        if isinstance(ctx, str):
            ctx = {"raw": ctx}

        def parse_focal(val):
            if isinstance(val, str) and "mm" in val:
                try:
                    return int(val.replace("mm", "").strip())
                except:
                    return 50
            return 50

        def parse_float(val, default=0.5):
            if isinstance(val, (int, float)):
                return float(val)
            if isinstance(val, str):
                try:
                    return float(val)
                except:
                    return default
            return default

        camera = CameraParams(
            angle=photo.get("camera_angle", "eye_level"),
            fov=photo.get("field_of_view", "normal"),
            lens_mm=parse_focal(photo.get("focal_length", 50)),
            depth_of_field=photo.get("depth_of_field", "medium"),
            shot_type=photo.get("shot_type", "medium")
        )

        lighting = LightingParams(
            direction=light.get("direction", "front"),
            intensity=parse_float(light.get("intensity"), 0.7),
            color_temp=5500,
            style=light.get("style", "natural"),
            time_of_day=light.get("time_of_day", "day")
        )

        palette = aes.get("color_palette", ["neutral"])
        if isinstance(palette, str):
            palette = [palette]

        color = ColorParams(
            palette=palette,
            saturation=parse_float(aes.get("saturation"), 0.5),
            contrast=parse_float(aes.get("contrast"), 0.5),
            mood=aes.get("mood", "neutral"),
            grade=aes.get("color_grade", "natural")
        )

        composition = CompositionParams(
            framing=ctx.get("framing", "centered") if isinstance(ctx, dict) else "centered",
            rule_of_thirds=True,
            symmetry=parse_float(ctx.get("symmetry", 0.5) if isinstance(ctx, dict) else 0.5),
            leading_lines=False
        )

        atmosphere = AtmosphereParams(
            weather=bg.get("weather", "clear") if isinstance(bg, dict) else "clear",
            particles=bg.get("particles", "none") if isinstance(bg, dict) else "none",
            haze=parse_float(bg.get("haze", 0.0) if isinstance(bg, dict) else 0.0),
            environment=bg.get("environment", "interior") if isinstance(bg, dict) else "interior"
        )

        dna = CinematographyDNA(
            camera=camera,
            lighting=lighting,
            color=color,
            composition=composition,
            atmosphere=atmosphere
        )

        # Return the raw structured prompt for use in refinement
        return dna, description, 0.85, structured


def blend_dna(dna_a: CinematographyDNA, dna_b: CinematographyDNA, ratio: float) -> CinematographyDNA:
    def lerp(a: float, b: float, t: float) -> float:
        return a + (b - a) * t

    def lerp_int(a: int, b: int, t: float) -> int:
        return int(a + (b - a) * t)

    def pick(a, b, t: float):
        return a if t < 0.5 else b

    camera = CameraParams(
        angle=pick(dna_a.camera.angle, dna_b.camera.angle, ratio),
        fov=pick(dna_a.camera.fov, dna_b.camera.fov, ratio),
        lens_mm=lerp_int(dna_a.camera.lens_mm, dna_b.camera.lens_mm, ratio),
        depth_of_field=pick(dna_a.camera.depth_of_field, dna_b.camera.depth_of_field, ratio),
        shot_type=pick(dna_a.camera.shot_type, dna_b.camera.shot_type, ratio)
    )

    lighting = LightingParams(
        direction=pick(dna_a.lighting.direction, dna_b.lighting.direction, ratio),
        intensity=lerp(dna_a.lighting.intensity, dna_b.lighting.intensity, ratio),
        color_temp=lerp_int(dna_a.lighting.color_temp, dna_b.lighting.color_temp, ratio),
        style=pick(dna_a.lighting.style, dna_b.lighting.style, ratio),
        time_of_day=pick(dna_a.lighting.time_of_day, dna_b.lighting.time_of_day, ratio)
    )

    color = ColorParams(
        palette=dna_a.color.palette if ratio < 0.5 else dna_b.color.palette,
        saturation=lerp(dna_a.color.saturation, dna_b.color.saturation, ratio),
        contrast=lerp(dna_a.color.contrast, dna_b.color.contrast, ratio),
        mood=pick(dna_a.color.mood, dna_b.color.mood, ratio),
        grade=pick(dna_a.color.grade, dna_b.color.grade, ratio)
    )

    composition = CompositionParams(
        framing=pick(dna_a.composition.framing, dna_b.composition.framing, ratio),
        rule_of_thirds=pick(dna_a.composition.rule_of_thirds, dna_b.composition.rule_of_thirds, ratio),
        symmetry=lerp(dna_a.composition.symmetry, dna_b.composition.symmetry, ratio),
        leading_lines=pick(dna_a.composition.leading_lines, dna_b.composition.leading_lines, ratio)
    )

    atmosphere = AtmosphereParams(
        weather=pick(dna_a.atmosphere.weather, dna_b.atmosphere.weather, ratio),
        particles=pick(dna_a.atmosphere.particles, dna_b.atmosphere.particles, ratio),
        haze=lerp(dna_a.atmosphere.haze, dna_b.atmosphere.haze, ratio),
        environment=pick(dna_a.atmosphere.environment, dna_b.atmosphere.environment, ratio)
    )

    return CinematographyDNA(
        camera=camera,
        lighting=lighting,
        color=color,
        composition=composition,
        atmosphere=atmosphere
    )
