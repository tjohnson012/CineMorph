import { create } from 'zustand';
import type { CinematographyDNA } from '../types/api';

interface AppState {
  // Image state
  originalImage: string | null;
  remixedImage: string | null;

  // DNA state
  extractedDNA: CinematographyDNA | null;
  modifiedDNA: CinematographyDNA | null;

  // NEW: Context for consistent remixing
  sourceImageUrl: string | null;  // Original image URL for FIBO
  seed: number | null;            // Seed for reproducibility
  structuredPrompt: Record<string, unknown> | null;  // Original FIBO structured prompt

  // UI state
  isLoading: boolean;
  error: string | null;

  // Actions
  setOriginalImage: (image: string | null) => void;
  setRemixedImage: (image: string | null) => void;
  setExtractedDNA: (dna: CinematographyDNA | null) => void;
  setModifiedDNA: (dna: CinematographyDNA | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // NEW: Set extraction context for consistent remixing
  setExtractionContext: (
    sourceImageUrl: string,
    seed: number,
    structuredPrompt: Record<string, unknown>
  ) => void;

  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  originalImage: null,
  remixedImage: null,
  extractedDNA: null,
  modifiedDNA: null,
  sourceImageUrl: null,
  seed: null,
  structuredPrompt: null,
  isLoading: false,
  error: null,

  // Actions
  setOriginalImage: (image) => set({ originalImage: image }),
  setRemixedImage: (image) => set({ remixedImage: image }),
  setExtractedDNA: (dna) => set({ extractedDNA: dna, modifiedDNA: dna }),
  setModifiedDNA: (dna) => set({ modifiedDNA: dna }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  setExtractionContext: (sourceImageUrl, seed, structuredPrompt) =>
    set({ sourceImageUrl, seed, structuredPrompt }),

  reset: () =>
    set({
      originalImage: null,
      remixedImage: null,
      extractedDNA: null,
      modifiedDNA: null,
      sourceImageUrl: null,
      seed: null,
      structuredPrompt: null,
      isLoading: false,
      error: null,
    }),
}));
