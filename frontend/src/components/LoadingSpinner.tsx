import { Film } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = 'Processing...' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <Film className="w-16 h-16 text-purple-500 animate-spin" />
      <p className="text-lg text-zinc-400">{message}</p>
    </div>
  );
}