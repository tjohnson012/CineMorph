import { API_URL } from '../config';
import type {
  ExtractResponse,
  RemixRequest,
  RemixResponse,
  BlendRequest,
  BlendResponse,
  PresetInfo,
  PresetResponse,
  ExportRequest,
} from '../types/api';

class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'APIError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.text();
    throw new APIError(
      `API Error: ${response.statusText}`,
      response.status,
      error
    );
  }
  return response.json();
}

export const api = {
  async extractDNA(file?: File, imageUrl?: string): Promise<ExtractResponse> {
    const formData = new FormData();
    if (file) {
      formData.append('image', file);
    }
    if (imageUrl) {
      formData.append('image_url', imageUrl);
    }

    const response = await fetch(`${API_URL}/extract`, {
      method: 'POST',
      body: formData,
    });

    return handleResponse<ExtractResponse>(response);
  },

  async remix(request: RemixRequest): Promise<RemixResponse> {
    const response = await fetch(`${API_URL}/remix`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    return handleResponse<RemixResponse>(response);
  },

  async blend(request: BlendRequest): Promise<BlendResponse> {
    const response = await fetch(`${API_URL}/blend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    return handleResponse<BlendResponse>(response);
  },

  async getPresets(): Promise<PresetInfo[]> {
    const response = await fetch(`${API_URL}/presets`);
    return handleResponse<PresetInfo[]>(response);
  },

  async applyPreset(
    presetName: string,
    file?: File,
    imageUrl?: string
  ): Promise<PresetResponse> {
    const formData = new FormData();
    formData.append('preset_name', presetName);
    if (file) {
      formData.append('image', file);
    }
    if (imageUrl) {
      formData.append('image_url', imageUrl);
    }

    const response = await fetch(`${API_URL}/preset`, {
      method: 'POST',
      body: formData,
    });

    return handleResponse<PresetResponse>(response);
  },

  async exportImage(request: ExportRequest): Promise<Blob> {
    const response = await fetch(`${API_URL}/export`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new APIError(
        `Export failed: ${response.statusText}`,
        response.status
      );
    }

    return response.blob();
  },
};