import { type ReactNode, type MouseEvent, type CSSProperties } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  style?: CSSProperties;
}

export function Card({ children, className = '', hover = true, onClick, style }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4 } : undefined}
      onClick={onClick}
      style={style}
      className={`
        bg-gradient-to-b from-zinc-900 to-zinc-900/80
        border border-zinc-800
        rounded-xl p-6
        transition-all duration-300
        ${hover ? `
          hover:border-purple-500/40
          hover:shadow-xl
          hover:shadow-purple-500/10
          hover:bg-gradient-to-b hover:from-zinc-800/90 hover:to-zinc-900/90
        ` : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
