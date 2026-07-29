import React from 'react';
import { cn } from './utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'emerald' | 'amber' | 'rose' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = 'default', children, ...props }) => {
  const base = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors';
  const variants = {
    default: 'bg-zinc-800 text-zinc-300 border border-zinc-700',
    emerald: 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/50',
    amber: 'bg-amber-950/80 text-amber-400 border border-amber-800/50',
    rose: 'bg-rose-950/80 text-rose-400 border border-rose-800/50',
    outline: 'border border-zinc-700 text-zinc-400',
  };

  return (
    <span className={cn(base, variants[variant], className)} {...props}>
      {children}
    </span>
  );
};
