import type { HTMLAttributes, ReactNode } from 'react';

interface NeoCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function NeoCard({ children, className = '', ...props }: NeoCardProps) {
  return (
    <div
      className={`
        bg-bg-main
        border-3 border-text
        shadow-neo
        p-6
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
