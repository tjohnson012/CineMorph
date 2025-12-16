import { type ChangeEvent, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface DropdownProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

export function Dropdown({ label, value, options, onChange }: DropdownProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  const formatOption = (option: string) => {
    return option
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-zinc-300">{label}</label>
      <motion.div
        className="relative"
        animate={isFocused ? { scale: 1.01 } : { scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <select
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full px-4 py-2.5
            bg-zinc-900/70 border rounded-lg
            text-white appearance-none cursor-pointer
            focus:outline-none transition-all duration-300
            ${isFocused
              ? 'border-purple-500 ring-2 ring-purple-500/20 bg-zinc-900'
              : 'border-zinc-700 hover:border-zinc-600'
            }
          `}
        >
          {options.map((option) => (
            <option key={option} value={option} className="bg-zinc-900 text-white">
              {formatOption(option)}
            </option>
          ))}
        </select>
        <motion.div
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
          animate={isFocused ? { rotate: 180 } : { rotate: 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className={`w-4 h-4 transition-colors ${isFocused ? 'text-purple-400' : 'text-zinc-500'}`} />
        </motion.div>
      </motion.div>
    </div>
  );
}
