import React from 'react';
import { cn } from './utils';

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-xl shadow-xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
