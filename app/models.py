from pydantic import BaseModel, Field, HttpUrl
from typing import Optional
from enum import Enum
import random


class CameraParams(BaseModel):
    angle: str = "eye_level"
    fov: str = "normal"
    lens_mm: int = 50
    depth_of_field: str = "medium"
    shot_type: str = "medium"


class LightingParams(BaseModel):
    direction: str = "front"
    intensity: float = Field(default=0.7, ge=0.0, le=1.0)
    color_temp: int = Field(default=2000, ge=2000, le=10000)
    style: str = "natural"
    time_of_day: str = "day"


class ColorParams(BaseModel):
    palette: list[str] = ["neutral"]
    saturation: float = Field(default=0.5, ge=0.0, le=1.0)
    contrast: float = Field(default=0.5, ge=0.0, le=1.0)
    mood: str = "neutral"
    grade: str = "natural"


class CompositionParams(BaseModel):
    framing: str = "centered"
    rule_of_thirds: bool = True
    symmetry: float = Field(default=0.5, ge=0.0, le=1.0)
    leading_lines: bool = False


class AtmosphereParams(BaseModel):
    weather: str = "clear"
    particles: str = "none"
    haze: float = Field(default=0.0, ge=0.0, le=1.0)
    environment: str = "interior"


class CinematographyDNA(BaseModel):
    camera: CameraParams = Field(default_factory=CameraParams)
    lighting: LightingParams = Field(default_factory=LightingParams)
    color: ColorParams = Field(default_factory=ColorParams)
    composition: CompositionParams = Field(default_factory=CompositionParams)
    atmosphere: AtmosphereParams = Field(default_factory=AtmosphereParams)


class ExtractRequest(BaseModel):
    image_url: Optional[HttpUrl] = None


class ExtractResponse(BaseModel):
    dna: CinematographyDNA
    source_description: str
    confidence: float
    # NEW: Include context needed for consistent remix
    source_image_url: str  # The original image URL for reference
    seed: int  # Seed for reproducible generation
    structured_prompt: dict  # The raw FIBO structured prompt


class RemixRequest(BaseModel):
    base_dna: CinematographyDNA
    modifications: dict
    # NEW: Required context for scene consistency
    source_image_url: str  # Original image for reference
    seed: int  # Same seed for consistency
    original_structured_prompt: Optional[dict] = None  # Original FIBO prompt


class RemixResponse(BaseModel):
    image_url: str
    modified_dna: CinematographyDNA
    generation_metadata: dict
    seed: int  # Return seed for future remixes


class BlendRequest(BaseModel):
    dna_a: CinematographyDNA
    dna_b: CinematographyDNA
    ratio: float = Field(default=0.5, ge=0.0, le=1.0)
    prompt: Optional[str] = None


class BlendResponse(BaseModel):
    image_url: str
    blended_dna: CinematographyDNA
    ratio: float


class PresetRequest(BaseModel):
    image_url: Optional[HttpUrl] = None
    preset_name: str


class PresetResponse(BaseModel):
    image_url: str
    applied_preset: str
    original_dna: CinematographyDNA
    styled_dna: CinematographyDNA
    # NEW: Context for further remixing
    source_image_url: str
    seed: int


class PresetInfo(BaseModel):
    name: str
    description: str
    signature_traits: list[str]


class ExportFormat(str, Enum):
    TIFF = "tiff"
    PNG = "png"
    JPEG = "jpeg"


class ExportRequest(BaseModel):
    image_url: str  # Changed from HttpUrl to allow fal.ai URLs
    format: ExportFormat = ExportFormat.PNG
    quality: int = Field(default=95, ge=1, le=100)


def generate_seed() -> int:
    """Generate a random seed for reproducible generation"""
    return random.randint(1, 2147483647)
