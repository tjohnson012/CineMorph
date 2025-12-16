import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: ReactNode;
  isLoading?: boolean;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({
  variant = 'primary',
  children,
  isLoading,
  className = '',
  disabled,
  onClick,
  type = 'button',
}: ButtonProps) {
  const baseStyles = `
    relative px-6 py-3 rounded-lg font-medium
    transition-all duration-300
    disabled:opacity-50 disabled:cursor-not-allowed
    flex items-center justify-center
  `;

  const variantStyles = {
    primary: `
      bg-gradient-to-r from-purple-600 to-purple-700
      hover:from-purple-500 hover:to-purple-600
      text-white
      shadow-lg shadow-purple-500/25
      hover:shadow-xl hover:shadow-purple-500/40
    `,
    secondary: `
      bg-gradient-to-r from-cyan-600 to-cyan-700
      hover:from-cyan-500 hover:to-cyan-600
      text-white
      shadow-lg shadow-cyan-500/20
      hover:shadow-xl hover:shadow-cyan-500/30
    `,
    ghost: `
      bg-transparent
      border border-zinc-700
      hover:border-purple-500/50
      hover:bg-purple-500/10
      text-white
    `,
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      onClick={onClick}
      type={type}
    >
      {/* Glow effect for primary/secondary */}
      {(variant === 'primary' || variant === 'secondary') && !disabled && !isLoading && (
        <motion.div
          className={`absolute inset-0 rounded-lg blur-lg opacity-0 hover:opacity-50 transition-opacity ${
            variant === 'primary' ? 'bg-purple-500' : 'bg-cyan-500'
          }`}
          style={{ zIndex: -1 }}
        />
      )}

      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Processing...
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
}
