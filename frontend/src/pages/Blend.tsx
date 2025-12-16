import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, Sparkles, Check } from 'lucide-react';
import { api } from '../api/client';
import { Button } from '../components/Button';
import { ImageUpload } from '../components/ImageUpload';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ToastContainer } from '../components/Toast';
import type { CinematographyDNA } from '../types/api';

export function Blend() {
  const [imageA, setImageA] = useState<string | null>(null);
  const [imageB, setImageB] = useState<string | null>(null);
  const [, setFileA] = useState<File | null>(null);
  const [, setFileB] = useState<File | null>(null);
  const [dnaA, setDnaA] = useState<CinematographyDNA | null>(null);
  const [dnaB, setDnaB] = useState<CinematographyDNA | null>(null);
  const [ratio, setRatio] = useState(50);
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [extractingA, setExtractingA] = useState(false);
  const [extractingB, setExtractingB] = useState(false);
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' }>>([]);

  const addToast = (message: string, type: 'success' | 'error') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleImageASelect = async (file: File) => {
    setFileA(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageA(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    setExtractingA(true);
    try {
      const response = await api.extractDNA(file);
      setDnaA(response.dna);
      addToast('Film A DNA extracted!', 'success');
    } catch (error) {
      addToast('Failed to extract DNA from Film A', 'error');
      console.error(error);
    } finally {
      setExtractingA(false);
    }
  };

  const handleImageBSelect = async (file: File) => {
    setFileB(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageB(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    setExtractingB(true);
    try {
      const response = await api.extractDNA(file);
      setDnaB(response.dna);
      addToast('Film B DNA extracted!', 'success');
    } catch (error) {
      addToast('Failed to extract DNA from Film B', 'error');
      console.error(error);
    } finally {
      setExtractingB(false);
    }
  };

  const handleBlend = async () => {
    if (!dnaA || !dnaB) {
      addToast('Please upload both images first', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.blend({
        dna_a: dnaA,
        dna_b: dnaB,
        ratio: ratio / 100,
      });
      setResult(response.image_url);
      addToast('Images blended successfully!', 'success');
    } catch (error) {
      addToast('Failed to blend images. Please try again.', 'error');
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
        <div className="absolute top-20 -left-40 w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 -right-40 w-[500px] h-[500px] bg-cyan-600/8 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
            Blend Mode
          </h1>
          <p className="text-xl text-zinc-400">
            Merge the cinematographic styles of two different films
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Film A */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`premium-card rounded-xl p-6 transition-all duration-500 ${
              dnaA ? 'upload-success border-green-500/30' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Film A</h2>
              {dnaA && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-1 text-green-400 text-sm"
                >
                  <Check className="w-4 h-4" />
                  DNA Ready
                </motion.div>
              )}
            </div>
            <ImageUpload
              onImageSelect={handleImageASelect}
              preview={imageA}
              label="Upload Film A"
            />
            {extractingA && (
              <div className="mt-3 text-sm text-purple-400 flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-4 h-4" />
                </motion.div>
                Extracting DNA...
              </div>
            )}
          </motion.div>

          {/* Blend Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center"
          >
            <div className="w-full space-y-6">
              <div className="flex items-center justify-center">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="relative"
                >
                  <Layers className="w-16 h-16 text-purple-500" />
                  <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl" />
                </motion.div>
              </div>

              <div className="premium-card rounded-xl p-6">
                <label className="block text-sm font-medium text-zinc-300 mb-4">
                  Blend Ratio
                </label>

                {/* Custom premium slider */}
                <div className="relative">
                  <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        width: `${ratio}%`,
                        background: 'linear-gradient(90deg, #7c3aed 0%, #06b6d4 100%)',
                      }}
                      layout
                    />
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={ratio}
                    onChange={(e) => setRatio(Number(e.target.value))}
                    className="absolute inset-0 w-full opacity-0 cursor-pointer"
                  />
                  {/* Glowing thumb indicator */}
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full pointer-events-none"
                    style={{
                      left: `calc(${ratio}% - 10px)`,
                      background: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)',
                      boxShadow: '0 0 15px rgba(124, 58, 237, 0.6), 0 0 30px rgba(124, 58, 237, 0.3)',
                    }}
                    layout
                  />
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{100 - ratio}%</div>
                    <div className="text-xs text-zinc-500 uppercase tracking-wider">Film A</div>
                  </div>
                  <div className="text-zinc-600">+</div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-400">{ratio}%</div>
                    <div className="text-xs text-zinc-500 uppercase tracking-wider">Film B</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Film B */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`premium-card rounded-xl p-6 transition-all duration-500 ${
              dnaB ? 'upload-success border-green-500/30' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Film B</h2>
              {dnaB && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-1 text-green-400 text-sm"
                >
                  <Check className="w-4 h-4" />
                  DNA Ready
                </motion.div>
              )}
            </div>
            <ImageUpload
              onImageSelect={handleImageBSelect}
              preview={imageB}
              label="Upload Film B"
            />
            {extractingB && (
              <div className="mt-3 text-sm text-purple-400 flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-4 h-4" />
                </motion.div>
                Extracting DNA...
              </div>
            )}
          </motion.div>
        </div>

        {/* Result Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="premium-card rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Blended Result</h2>
            <Button
              variant="primary"
              onClick={handleBlend}
              isLoading={isLoading}
              disabled={!dnaA || !dnaB}
              className="glow-button"
            >
              <Layers className="w-5 h-5 mr-2" />
              Generate Blend
            </Button>
          </div>

          {isLoading ? (
            <LoadingSpinner message="Blending cinematographic styles..." />
          ) : result ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <img
                src={result}
                alt="Blended result"
                className="w-full max-h-96 object-contain rounded-lg bg-zinc-950"
              />
              <p className="text-center text-zinc-400">
                <span className="text-purple-400">{100 - ratio}%</span> Film A +{' '}
                <span className="text-cyan-400">{ratio}%</span> Film B
              </p>
            </motion.div>
          ) : (
            <div className="w-full h-96 flex flex-col items-center justify-center bg-zinc-950/50 rounded-lg empty-state border border-zinc-800/50 relative overflow-hidden">
              {/* Animated corner particles */}
              <motion.div
                className="absolute top-4 left-4 w-2 h-2 bg-purple-500/50 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute top-4 right-4 w-2 h-2 bg-cyan-500/50 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              />
              <motion.div
                className="absolute bottom-4 left-4 w-2 h-2 bg-cyan-500/50 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              />
              <motion.div
                className="absolute bottom-4 right-4 w-2 h-2 bg-purple-500/50 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
              />

              <Layers className="w-16 h-16 text-zinc-700 mb-4" />
              <p className="text-zinc-500 text-lg">Blended result will appear here</p>
              <p className="text-zinc-600 text-sm mt-2">Upload two films and adjust the blend ratio</p>
            </div>
          )}
        </motion.div>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </motion.div>
  );
}
