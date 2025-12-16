import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles, ImageIcon } from 'lucide-react';
import { api } from '../api/client';
import { useAppStore } from '../store/useAppStore';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ImageUpload } from '../components/ImageUpload';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ToastContainer } from '../components/Toast';
import type { PresetInfo } from '../types/api';

// Director display names and signature gradients
const directorStyles: Record<string, { displayName: string; gradient: string; glow: string }> = {
  kubrick: {
    displayName: 'Stanley Kubrick',
    gradient: 'bg-gradient-to-b from-blue-100 via-slate-300 to-blue-950',
    glow: 'rgba(59, 130, 246, 0.4)',
  },
  tarantino: {
    displayName: 'Quentin Tarantino',
    gradient: 'bg-gradient-to-br from-yellow-400 via-red-500 to-red-900',
    glow: 'rgba(239, 68, 68, 0.4)',
  },
  wes_anderson: {
    displayName: 'Wes Anderson',
    gradient: 'bg-gradient-to-r from-pink-300 via-amber-100 to-teal-200',
    glow: 'rgba(236, 72, 153, 0.4)',
  },
  villeneuve: {
    displayName: 'Denis Villeneuve',
    gradient: 'bg-gradient-to-br from-orange-400/70 via-stone-500 to-teal-800',
    glow: 'rgba(20, 184, 166, 0.4)',
  },
  nolan: {
    displayName: 'Christopher Nolan',
    gradient: 'bg-gradient-to-b from-slate-600 via-blue-950 to-zinc-900',
    glow: 'rgba(30, 58, 138, 0.4)',
  },
  wong_kar_wai: {
    displayName: 'Wong Kar-wai',
    gradient: 'bg-gradient-to-br from-fuchsia-500 via-purple-600 to-emerald-400',
    glow: 'rgba(192, 38, 211, 0.4)',
  },
  fincher: {
    displayName: 'David Fincher',
    gradient: 'bg-gradient-to-b from-yellow-600/50 via-green-900/70 to-zinc-900',
    glow: 'rgba(132, 204, 22, 0.3)',
  },
  spielberg: {
    displayName: 'Steven Spielberg',
    gradient: 'bg-gradient-to-br from-amber-300 via-orange-400 to-yellow-500',
    glow: 'rgba(251, 191, 36, 0.5)',
  },
};

const getDirectorStyle = (name: string) => {
  const key = name.toLowerCase().replace(/\s+/g, '_');
  return directorStyles[key] || { displayName: name, gradient: 'bg-gradient-to-br from-purple-900/40 to-cyan-900/40', glow: 'rgba(124, 58, 237, 0.3)' };
};

export function Presets() {
  // Get existing extraction context from Studio page (if available)
  const { originalImage: studioImage, extractedDNA, sourceImageUrl } = useAppStore();

  const [presets, setPresets] = useState<PresetInfo[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<PresetInfo | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [useStudioImage, setUseStudioImage] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' }>>([]);

  // Check if there's an extracted image from Studio
  const hasStudioImage = !!(studioImage && extractedDNA && sourceImageUrl);

  useEffect(() => {
    loadPresets();
  }, []);

  const loadPresets = async () => {
    try {
      const data = await api.getPresets();
      setPresets(data);
    } catch (error) {
      console.error('Failed to load presets:', error);
    }
  };

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
      setUploadedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleApplyPreset = async () => {
    // Check if using studio image or uploaded file
    const hasImage = useStudioImage ? hasStudioImage : !!uploadedFile;

    if (!selectedPreset || !hasImage) {
      addToast('Please select a preset and choose an image', 'error');
      return;
    }

    setIsLoading(true);
    try {
      let response;
      if (useStudioImage && sourceImageUrl) {
        // Use the already-extracted image from Studio
        // Pass the sourceImageUrl which is either a data URI or URL
        response = await api.applyPreset(selectedPreset.name, undefined, sourceImageUrl);
      } else {
        // Use newly uploaded file
        response = await api.applyPreset(selectedPreset.name, uploadedFile!);
      }

      setResult(response.image_url);
      const style = getDirectorStyle(selectedPreset.name);
      addToast(`${style.displayName} preset applied successfully!`, 'success');
    } catch (error) {
      addToast('Failed to apply preset. Please try again.', 'error');
      console.error(error);
    } finally {
      setIsLoading(false);
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
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
            Director Presets
          </h1>
          <p className="text-xl text-zinc-400">
            Apply the signature cinematographic style of legendary filmmakers
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {presets.map((preset, index) => {
            const style = getDirectorStyle(preset.name);
            const isSelected = selectedPreset?.name === preset.name;

            return (
              <motion.div
                key={preset.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="director-card"
              >
                <Card
                  hover
                  className={`cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? 'border-purple-500 ring-2 ring-purple-500/30'
                      : 'hover:border-zinc-600'
                  }`}
                  onClick={() => setSelectedPreset(preset)}
                  style={{
                    boxShadow: isSelected ? `0 0 40px ${style.glow}` : undefined,
                  }}
                >
                  {/* Director signature gradient */}
                  <div
                    className={`director-gradient relative w-full h-36 ${style.gradient} rounded-lg mb-4 overflow-hidden transition-all duration-300`}
                  >
                    {/* Lens flare effect for Spielberg */}
                    {preset.name === 'spielberg' && (
                      <div className="absolute top-4 right-6 w-8 h-8 bg-white/60 rounded-full blur-md" />
                    )}
                    {/* Center line for Kubrick */}
                    {preset.name === 'kubrick' && (
                      <div className="absolute inset-y-0 left-1/2 w-px bg-white/30" />
                    )}
                    {/* Neon glow for Wong Kar-wai */}
                    {preset.name === 'wong_kar_wai' && (
                      <>
                        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute top-2 left-2 w-2 h-2 bg-fuchsia-400 rounded-full blur-sm animate-pulse" />
                        <div className="absolute bottom-4 right-4 w-2 h-2 bg-emerald-400 rounded-full blur-sm animate-pulse" style={{ animationDelay: '0.5s' }} />
                      </>
                    )}
                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-white drop-shadow-lg" />
                      </div>
                    )}
                  </div>

                  <h3 className="font-semibold mb-2 text-white group-hover:text-purple-300 transition-colors">
                    {style.displayName}
                  </h3>
                  <p className="text-sm text-zinc-500 mb-3">{preset.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {preset.signature_traits.slice(0, 2).map((trait) => (
                      <span
                        key={trait}
                        className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {selectedPreset && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6"
            onClick={() => setSelectedPreset(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 25 }}
              className="premium-card rounded-xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold">{getDirectorStyle(selectedPreset.name).displayName}</h2>
                <button
                  onClick={() => setSelectedPreset(null)}
                  className="text-zinc-400 hover:text-white transition-colors p-2 hover:bg-zinc-800 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <p className="text-zinc-400 mb-6">{selectedPreset.description}</p>

              <div className="flex flex-wrap gap-2 mb-8">
                {selectedPreset.signature_traits.map((trait) => (
                  <span
                    key={trait}
                    className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30"
                  >
                    {trait}
                  </span>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Choose Image</h3>

                  {/* Option to use Studio image if available */}
                  {hasStudioImage && (
                    <div className="mb-4">
                      <button
                        onClick={() => {
                          setUseStudioImage(true);
                          setUploadedFile(null);
                          setUploadedImage(null);
                        }}
                        className={`w-full p-3 rounded-lg border transition-all ${
                          useStudioImage
                            ? 'border-purple-500 bg-purple-500/10 ring-2 ring-purple-500/30'
                            : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-zinc-900 flex-shrink-0">
                            <img
                              src={studioImage!}
                              alt="Studio"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="text-left flex-1">
                            <div className="flex items-center gap-2">
                              <ImageIcon className="w-4 h-4 text-purple-400" />
                              <span className="font-medium text-sm">Use Current Image</span>
                            </div>
                            <p className="text-xs text-zinc-500 mt-0.5">
                              From Studio (DNA already extracted)
                            </p>
                          </div>
                          {useStudioImage && (
                            <Sparkles className="w-5 h-5 text-purple-400" />
                          )}
                        </div>
                      </button>

                      <div className="flex items-center gap-3 my-3">
                        <div className="flex-1 h-px bg-zinc-800" />
                        <span className="text-xs text-zinc-600 uppercase">or</span>
                        <div className="flex-1 h-px bg-zinc-800" />
                      </div>
                    </div>
                  )}

                  {/* Upload new image option */}
                  <div
                    onClick={() => setUseStudioImage(false)}
                    className={`${!useStudioImage && uploadedImage ? 'ring-2 ring-purple-500/30' : ''} rounded-lg`}
                  >
                    <ImageUpload
                      onImageSelect={(file) => {
                        handleImageSelect(file);
                        setUseStudioImage(false);
                      }}
                      preview={!useStudioImage ? uploadedImage : null}
                      label="Upload New Image"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Result</h3>
                  {isLoading ? (
                    <LoadingSpinner message="Applying preset..." />
                  ) : result ? (
                    <img
                      src={result}
                      alt="Result"
                      className="w-full h-64 object-contain rounded-lg bg-zinc-950"
                    />
                  ) : (
                    <div className="w-full h-64 flex items-center justify-center bg-zinc-950 rounded-lg empty-state border border-zinc-800">
                      <p className="text-zinc-500 relative z-10">Result will appear here</p>
                    </div>
                  )}
                </div>
              </div>

              <Button
                variant="primary"
                onClick={handleApplyPreset}
                isLoading={isLoading}
                disabled={!(useStudioImage ? hasStudioImage : uploadedFile)}
                className="w-full mt-6 glow-button"
              >
                Apply {getDirectorStyle(selectedPreset.name).displayName} Preset
              </Button>
            </motion.div>
          </motion.div>
        )}
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </motion.div>
  );
}
