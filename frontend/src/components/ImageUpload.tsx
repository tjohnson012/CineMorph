import { useState, useRef, type ChangeEvent, type DragEvent } from 'react';
import { Upload, ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  onUrlSubmit?: (url: string) => void;
  preview?: string | null;
  label?: string;
}

export function ImageUpload({ onImageSelect, onUrlSubmit, preview, label = 'Upload Image' }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [url, setUrl] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      onImageSelect(files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onImageSelect(files[0]);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url && onUrlSubmit) {
      onUrlSubmit(url);
      setUrl('');
    }
  };

  return (
    <div className="space-y-4">
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        whileHover={{ scale: 1.01 }}
        className={`relative rounded-xl p-8 cursor-pointer transition-all duration-300 overflow-hidden ${
          isDragging
            ? 'bg-purple-500/10'
            : 'bg-zinc-900/50 hover:bg-zinc-900/70'
        } ${preview ? '' : isHovering || isDragging ? 'animated-border' : 'border-2 border-dashed border-zinc-700'}`}
      >
        {/* Gradient glow on hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-r from-purple-500/5 to-cyan-500/5 transition-opacity duration-500 ${
            isHovering ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-64 object-contain rounded-lg"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
              <p className="text-white text-sm">Click to replace</p>
            </div>
          </div>
        ) : (
          <div className="relative flex flex-col items-center justify-center gap-4 text-center py-8">
            <motion.div
              animate={isHovering ? { y: [0, -8, 0] } : {}}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
            >
              {isHovering ? (
                <ImageIcon className="w-12 h-12 text-purple-400" />
              ) : (
                <Upload className="w-12 h-12 text-zinc-500" />
              )}
              {/* Glow effect on hover */}
              <div
                className={`absolute inset-0 bg-purple-500/30 rounded-full blur-xl transition-opacity duration-300 ${
                  isHovering ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </motion.div>
            <div>
              <p className={`text-lg font-medium transition-colors ${isHovering ? 'text-purple-300' : 'text-white'}`}>
                {label}
              </p>
              <p className="text-sm text-zinc-400 mt-1">
                Drag & drop or click to browse
              </p>
              <p className="text-xs text-zinc-600 mt-2">
                Supports JPG, PNG, WebP
              </p>
            </div>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </motion.div>

      {onUrlSubmit && (
        <form onSubmit={handleUrlSubmit} className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Or paste image URL"
            className="flex-1 px-4 py-2.5 bg-zinc-900/70 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all"
          />
          <button
            type="submit"
            disabled={!url}
            className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-purple-500/10"
          >
            Load
          </button>
        </form>
      )}
    </div>
  );
}
