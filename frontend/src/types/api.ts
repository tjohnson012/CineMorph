export interface CameraParams {
  angle: string;
  fov: string;
  lens_mm: number;
  depth_of_field: string;
  shot_type: string;
}

export interface LightingParams {
  direction: string;
  intensity: number;
  color_temp: number;
  style: string;
  time_of_day: string;
}

export interface ColorParams {
  palette: string[];
  saturation: number;
  contrast: number;
  mood: string;
  grade: string;
}

export interface CompositionParams {
  framing: string;
  rule_of_thirds: boolean;
  symmetry: number;
  leading_lines: boolean;
}

export interface AtmosphereParams {
  weather: string;
  particles: string;
  haze: number;
  environment: string;
}

export interface CinematographyDNA {
  camera: CameraParams;
  lighting: LightingParams;
  color: ColorParams;
  composition: CompositionParams;
  atmosphere: AtmosphereParams;
}

export interface ExtractResponse {
  dna: CinematographyDNA;
  source_description: string;
  confidence: number;
  // NEW: Context for consistent remixing
  source_image_url: string;
  seed: number;
  structured_prompt: Record<string, unknown>;
}

export interface RemixRequest {
  base_dna: CinematographyDNA;
  modifications: Record<string, unknown>;
  // NEW: Required for scene consistency
  source_image_url: string;
  seed: number;
  original_structured_prompt?: Record<string, unknown>;
}

export interface RemixResponse {
  image_url: string;
  modified_dna: CinematographyDNA;
  generation_metadata: {
    model: string;
    seed?: number;
    steps?: number;
    duration_ms?: number;
    modifications?: Record<string, unknown>;
  };
  seed: number;
}

export interface BlendRequest {
  dna_a: CinematographyDNA;
  dna_b: CinematographyDNA;
  ratio: number;
  prompt?: string;
}

export interface BlendResponse {
  image_url: string;
  blended_dna: CinematographyDNA;
  ratio: number;
}

export interface PresetInfo {
  name: string;
  description: string;
  signature_traits: string[];
}

export interface PresetResponse {
  image_url: string;
  applied_preset: string;
  original_dna: CinematographyDNA;
  styled_dna: CinematographyDNA;
  // NEW: Context for further remixing
  source_image_url: string;
  seed: number;
}

export type ExportFormat = 'tiff' | 'png' | 'jpeg';

export interface ExportRequest {
  image_url: string;
  format: ExportFormat;
  quality?: number;
}
