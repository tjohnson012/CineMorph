import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Sun,
  Palette,
  CloudFog,
  Code2,
  ChevronDown,
  Copy,
  Check,
  Sparkles
} from 'lucide-react';
import type { CinematographyDNA } from '../types/api';

interface DNASummaryProps {
  dna: CinematographyDNA;
  structuredPrompt?: Record<string, unknown> | null;
  confidence?: number;
}

export function DNASummary({ dna, structuredPrompt, confidence = 0.85 }: DNASummaryProps) {
  const [showJSON, setShowJSON] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const data = {
      dna,
      structured_prompt: structuredPrompt,
    };
    await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const summaryItems = [
    {
      icon: Camera,
      label: 'Camera',
      value: `${dna.camera.angle.replace('_', ' ')}, ${dna.camera.lens_mm}mm, ${dna.camera.shot_type} shot`,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
    },
    {
      icon: Sun,
      label: 'Lighting',
      value: `${dna.lighting.style}, ${dna.lighting.direction}, ${dna.lighting.time_of_day}`,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
    },
    {
      icon: Palette,
      label: 'Color',
      value: `${dna.color.mood} mood, ${dna.color.grade} grade`,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
    },
    {
      icon: CloudFog,
      label: 'Atmosphere',
      value: `${dna.atmosphere.environment}, ${dna.atmosphere.weather}`,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/20',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="premium-card rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-zinc-800/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center border border-purple-500/30"
            >
              <Sparkles className="w-5 h-5 text-purple-400" />
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
            >
              <Check className="w-2.5 h-2.5 text-white" />
            </motion.div>
          </div>
          <div>
            <h3 className="font-semibold text-white">DNA Extracted</h3>
            <p className="text-xs text-zinc-500">
              Confidence: <span className="text-green-400">{Math.round(confidence * 100)}%</span>
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowJSON(!showJSON)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-400 hover:text-white bg-zinc-800/50 hover:bg-zinc-800 rounded-lg transition-colors border border-zinc-700/50"
        >
          <Code2 className="w-4 h-4" />
          <span>{showJSON ? 'Hide' : 'View'} JSON</span>
          <motion.div
            animate={{ rotate: showJSON ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.button>
      </div>

      {/* Summary Grid */}
      <div className="p-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {summaryItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className={`p-3 rounded-lg ${item.bgColor} border ${item.borderColor} group hover:scale-[1.02] transition-transform`}
            >
              <div className="flex items-center gap-2 mb-2">
                <item.icon className={`w-4 h-4 ${item.color}`} />
                <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  {item.label}
                </span>
              </div>
              <p className="text-sm text-white font-medium leading-snug">
                {item.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Additional Details Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-3 flex flex-wrap gap-2"
        >
          <span className="px-2 py-1 text-xs rounded-full bg-zinc-800/50 text-zinc-400 border border-zinc-700/50">
            DoF: {dna.camera.depth_of_field}
          </span>
          <span className="px-2 py-1 text-xs rounded-full bg-zinc-800/50 text-zinc-400 border border-zinc-700/50">
            Saturation: {Math.round(dna.color.saturation * 100)}%
          </span>
          <span className="px-2 py-1 text-xs rounded-full bg-zinc-800/50 text-zinc-400 border border-zinc-700/50">
            Contrast: {Math.round(dna.color.contrast * 100)}%
          </span>
          <span className="px-2 py-1 text-xs rounded-full bg-zinc-800/50 text-zinc-400 border border-zinc-700/50">
            Haze: {Math.round(dna.atmosphere.haze * 100)}%
          </span>
          {dna.color.palette.length > 0 && (
            <span className="px-2 py-1 text-xs rounded-full bg-zinc-800/50 text-zinc-400 border border-zinc-700/50">
              Palette: {dna.color.palette.slice(0, 3).join(', ')}
            </span>
          )}
        </motion.div>
      </div>

      {/* Expandable JSON View */}
      <AnimatePresence>
        {showJSON && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-zinc-800/50">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Full DNA Structure
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-2 py-1 text-xs text-zinc-400 hover:text-white bg-zinc-800/50 hover:bg-zinc-800 rounded transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-green-400" />
                        <span className="text-green-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </motion.button>
                </div>
                <div className="relative">
                  <pre className="p-4 rounded-lg bg-zinc-950 border border-zinc-800/50 overflow-x-auto text-xs font-mono max-h-96 overflow-y-auto custom-scrollbar">
                    <code>
                      <JSONHighlight data={dna} />
                    </code>
                  </pre>
                </div>

                {structuredPrompt && Object.keys(structuredPrompt).length > 0 && (
                  <div className="mt-4">
                    <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider block mb-3">
                      FIBO Structured Prompt
                    </span>
                    <pre className="p-4 rounded-lg bg-zinc-950 border border-zinc-800/50 overflow-x-auto text-xs font-mono max-h-64 overflow-y-auto custom-scrollbar">
                      <code>
                        <JSONHighlight data={structuredPrompt} />
                      </code>
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Simple JSON syntax highlighter component
function JSONHighlight({ data }: { data: unknown }) {
  const highlight = (obj: unknown, indent: number = 0): JSX.Element[] => {
    const spaces = '  '.repeat(indent);
    const elements: JSX.Element[] = [];

    if (obj === null) {
      return [<span key="null" className="text-orange-400">null</span>];
    }

    if (typeof obj === 'boolean') {
      return [<span key="bool" className="text-orange-400">{obj.toString()}</span>];
    }

    if (typeof obj === 'number') {
      return [<span key="num" className="text-cyan-400">{obj}</span>];
    }

    if (typeof obj === 'string') {
      return [<span key="str" className="text-green-400">"{obj}"</span>];
    }

    if (Array.isArray(obj)) {
      if (obj.length === 0) {
        return [<span key="empty-arr" className="text-zinc-500">[]</span>];
      }
      elements.push(<span key="arr-open" className="text-zinc-400">[{'\n'}</span>);
      obj.forEach((item, i) => {
        elements.push(
          <span key={`arr-item-${i}`}>
            {spaces}  {highlight(item, indent + 1)}
            {i < obj.length - 1 ? <span className="text-zinc-500">,</span> : null}
            {'\n'}
          </span>
        );
      });
      elements.push(<span key="arr-close">{spaces}<span className="text-zinc-400">]</span></span>);
      return elements;
    }

    if (typeof obj === 'object') {
      const entries = Object.entries(obj);
      if (entries.length === 0) {
        return [<span key="empty-obj" className="text-zinc-500">{'{}'}</span>];
      }
      elements.push(<span key="obj-open" className="text-zinc-400">{'{'}{'\n'}</span>);
      entries.forEach(([key, value], i) => {
        elements.push(
          <span key={`obj-${key}`}>
            {spaces}  <span className="text-purple-400">"{key}"</span>
            <span className="text-zinc-500">: </span>
            {highlight(value, indent + 1)}
            {i < entries.length - 1 ? <span className="text-zinc-500">,</span> : null}
            {'\n'}
          </span>
        );
      });
      elements.push(<span key="obj-close">{spaces}<span className="text-zinc-400">{'}'}</span></span>);
      return elements;
    }

    return [<span key="unknown">{String(obj)}</span>];
  };

  return <>{highlight(data)}</>;
}
