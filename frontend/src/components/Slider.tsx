import { type ChangeEvent, useState } from 'react';
import { motion } from 'framer-motion';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  unit?: string;
}

export function Slider({ label, value, min, max, step = 1, onChange, unit = '' }: SliderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-zinc-300">{label}</label>
        <motion.span
          animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
          className={`text-sm font-mono px-2 py-0.5 rounded ${
            isDragging ? 'bg-purple-500/20 text-purple-300' : 'text-purple-400'
          } transition-colors`}
        >
          {value}{unit}
        </motion.span>
      </div>
      <div className="relative h-2 group">
        {/* Track background */}
        <div className="absolute inset-0 bg-zinc-800 rounded-full overflow-hidden">
          {/* Filled track */}
          <motion.div
            className="h-full rounded-full"
            style={{
              width: `${percentage}%`,
              background: 'linear-gradient(90deg, #7c3aed 0%, #06b6d4 100%)',
            }}
            layout
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </div>

        {/* Invisible range input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
        />

        {/* Custom thumb */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full pointer-events-none"
          style={{
            left: `calc(${percentage}% - 8px)`,
            background: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)',
            boxShadow: isDragging
              ? '0 0 20px rgba(124, 58, 237, 0.8), 0 0 40px rgba(124, 58, 237, 0.4)'
              : '0 0 10px rgba(124, 58, 237, 0.4)',
          }}
          animate={{
            scale: isDragging ? 1.3 : 1,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        />

        {/* Hover glow effect */}
        <div
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${percentage}% 50%, rgba(124, 58, 237, 0.2) 0%, transparent 50%)`,
          }}
        />
      </div>
    </div>
  );
}
