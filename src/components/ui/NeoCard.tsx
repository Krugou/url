import type { HTMLAttributes, ReactNode } from 'react';

interface NeoCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function NeoCard({ children, className = '', ...props }: NeoCardProps) {
  return (
    <div
      className={`
        bg-white/80
        backdrop-blur-md
        border border-slate-100/80
        rounded-2xl
        shadow-neo
        p-6
        transition-all duration-200
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
