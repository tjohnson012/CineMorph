import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Shuffle, Upload, Sparkles, ImageIcon } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { api } from '../api/client';
import { Button } from '../components/Button';
import { ImageUpload } from '../components/ImageUpload';
import { DNAControls } from '../components/DNAControls';
import { DNASummary } from '../components/DNASummary';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ToastContainer } from '../components/Toast';
import type { CinematographyDNA, ExportFormat } from '../types/api';

export function Studio() {
  const {
    originalImage,
    remixedImage,
    extractedDNA,
    modifiedDNA,
    isLoading,
    // NEW: Context for consistent remixing
    sourceImageUrl,
    seed,
    structuredPrompt,
    setOriginalImage,
    setRemixedImage,
    setExtractedDNA,
    setModifiedDNA,
    setLoading,
    setExtractionContext,
  } = useAppStore();

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' }>>([]);
  const [isExtracting, setIsExtracting] = useState(false);

  const addToast = (message: string, type: 'success' | 'error') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleImageSelect = (file: File) => {
    setUploadedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = (url: string) => {
    setOriginalImage(url);
  };

  const handleExtract = async () => {
    if (!uploadedFile && !originalImage) {
      addToast('Please upload an image first', 'error');
      return;
    }

    setLoading(true);
    setIsExtracting(true);
    try {
      const response = await api.extractDNA(uploadedFile || undefined, originalImage || undefined);
      setExtractedDNA(response.dna);

      // CRITICAL: Store context needed for consistent remixing
      // This preserves the source image URL, seed, and structured prompt
      // so that remix uses the SAME reference for scene consistency
      setExtractionContext(
        response.source_image_url,
        response.seed,
        response.structured_prompt
      );

      addToast('DNA extracted successfully!', 'success');
    } catch (error) {
      addToast('Failed to extract DNA. Please try again.', 'error');
      console.error(error);
    } finally {
      setLoading(false);
      setIsExtracting(false);
    }
  };

  const handleRemix = async () => {
    if (!extractedDNA || !modifiedDNA) {
      addToast('Please extract DNA first', 'error');
      return;
    }

    // CRITICAL: Ensure we have context from extraction for scene consistency
    if (!sourceImageUrl || !seed) {
      addToast('Missing extraction context. Please re-extract DNA.', 'error');
      return;
    }

    setLoading(true);
    try {
      const modifications: Record<string, unknown> = {};

      Object.keys(modifiedDNA).forEach((category) => {
        const categoryKey = category as keyof CinematographyDNA;
        const original = extractedDNA[categoryKey];
        const modified = modifiedDNA[categoryKey];

        Object.keys(modified).forEach((key) => {
          if (JSON.stringify(original[key as keyof typeof original]) !== JSON.stringify(modified[key as keyof typeof modified])) {
            modifications[`${category}.${key}`] = modified[key as keyof typeof modified];
          }
        });
      });

      // CRITICAL: Pass context for scene consistency
      // - source_image_url: Original image as reference for FIBO
      // - seed: Same seed ensures reproducibility
      // - original_structured_prompt: FIBO's structured prompt for better context
      const response = await api.remix({
        base_dna: extractedDNA,
        modifications,
        source_image_url: sourceImageUrl,
        seed: seed,
        original_structured_prompt: structuredPrompt || undefined,
      });

      setRemixedImage(response.image_url);
      addToast('Image remixed successfully!', 'success');
    } catch (error) {
      addToast('Failed to remix image. Please try again.', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: ExportFormat) => {
    if (!remixedImage) {
      addToast('No remixed image to export', 'error');
      return;
    }

    try {
      const blob = await api.exportImage({
        image_url: remixedImage,
        format,
        quality: 95,
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cinemorph_export.${format}`;
      a.click();
      URL.revokeObjectURL(url);

      addToast(`Exported as ${format.toUpperCase()}`, 'success');
    } catch (error) {
      addToast('Failed to export image', 'error');
      console.error(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen page-bg py-8 relative"
    >
      {/* Floating background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 -left-40 w-[600px] h-[600px] bg-purple-600/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-10 -right-40 w-[600px] h-[600px] bg-cyan-600/8 rounded-full blur-[150px]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
          {/* Original Image Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-4"
          >
            <div className="premium-card rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-purple-400" />
                Original
              </h2>
              <ImageUpload
                onImageSelect={handleImageSelect}
                onUrlSubmit={handleUrlSubmit}
                preview={originalImage}
                label="Upload Image"
              />
              <Button
                variant="primary"
                onClick={handleExtract}
                isLoading={isLoading && isExtracting}
                disabled={!originalImage}
                className="w-full mt-4 glow-button"
              >
                {isExtracting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                    </motion.div>
                    Extracting DNA...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Extract DNA
                  </>
                )}
              </Button>
            </div>
          </motion.div>

          {/* Remixed Image Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-4"
          >
            <div className="premium-card rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Shuffle className="w-5 h-5 text-cyan-400" />
                Remixed
              </h2>
              {isLoading && !isExtracting ? (
                <LoadingSpinner message="Processing your image..." />
              ) : remixedImage ? (
                <motion.img
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={remixedImage}
                  alt="Remixed"
                  className="w-full h-64 object-contain rounded-lg bg-zinc-950"
                />
              ) : (
                <div className="w-full h-64 flex flex-col items-center justify-center bg-zinc-950/50 rounded-lg empty-state border border-zinc-800/50 relative overflow-hidden">
                  <motion.div
                    className="absolute top-3 right-3 w-1.5 h-1.5 bg-purple-500/40 rounded-full"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-cyan-500/40 rounded-full"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                  />
                  <Shuffle className="w-12 h-12 text-zinc-700 mb-3" />
                  <p className="text-zinc-500">Remixed result will appear here</p>
                </div>
              )}
              <div className="flex gap-2 mt-4">
                <Button
                  variant="secondary"
                  onClick={handleRemix}
                  isLoading={isLoading && !isExtracting}
                  disabled={!modifiedDNA}
                  className="flex-1"
                >
                  <Shuffle className="w-5 h-5 mr-2" />
                  Remix
                </Button>
                {remixedImage && (
                  <div className="relative group">
                    <Button variant="ghost">
                      <Upload className="w-5 h-5 mr-2" />
                      Export
                    </Button>
                    <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl overflow-hidden min-w-[160px]">
                      <button
                        onClick={() => handleExport('tiff')}
                        className="block w-full px-4 py-3 text-left hover:bg-zinc-800 transition-colors text-sm"
                      >
                        <span className="font-medium">TIFF</span>
                        <span className="text-zinc-500 ml-2">16-bit HDR</span>
                      </button>
                      <button
                        onClick={() => handleExport('png')}
                        className="block w-full px-4 py-3 text-left hover:bg-zinc-800 transition-colors text-sm"
                      >
                        <span className="font-medium">PNG</span>
                        <span className="text-zinc-500 ml-2">Lossless</span>
                      </button>
                      <button
                        onClick={() => handleExport('jpeg')}
                        className="block w-full px-4 py-3 text-left hover:bg-zinc-800 transition-colors text-sm"
                      >
                        <span className="font-medium">JPEG</span>
                        <span className="text-zinc-500 ml-2">95% quality</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Keyboard Shortcuts Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="premium-card rounded-xl p-4 sticky top-24">
              <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-zinc-400">Shortcuts</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Extract</span>
                  <kbd className="px-2.5 py-1 bg-zinc-800/80 rounded text-xs font-mono border border-zinc-700">E</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Remix</span>
                  <kbd className="px-2.5 py-1 bg-zinc-800/80 rounded text-xs font-mono border border-zinc-700">R</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Presets</span>
                  <kbd className="px-2.5 py-1 bg-zinc-800/80 rounded text-xs font-mono border border-zinc-700">P</kbd>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* DNA Summary Panel - Shows extracted DNA structure */}
        {extractedDNA && (
          <div className="mb-6">
            <DNASummary
              dna={extractedDNA}
              structuredPrompt={structuredPrompt}
              confidence={0.85}
            />
          </div>
        )}

        {/* DNA Controls Panel */}
        {modifiedDNA && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="premium-card rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                  DNA Controls
                </h2>
                <p className="text-sm text-zinc-500 mt-1">Fine-tune every aspect of your cinematographic DNA</p>
              </div>
              <Button
                variant="ghost"
                onClick={() => setModifiedDNA(extractedDNA)}
                disabled={!extractedDNA}
                className="text-sm"
              >
                Reset to Original
              </Button>
            </div>
            <DNAControls dna={modifiedDNA} onChange={setModifiedDNA} />
          </motion.div>
        )}
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </motion.div>
  );
}
