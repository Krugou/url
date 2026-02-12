import type { ButtonHTMLAttributes, ReactNode } from 'react';

type NeoButtonVariant = 'primary' | 'secondary' | 'accent';

interface NeoButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: NeoButtonVariant;
  isLoading?: boolean;
}

const variantStyles: Record<NeoButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-hover',
  secondary: 'bg-secondary text-text hover:bg-secondary-hover',
  accent: 'bg-accent text-text hover:bg-accent-hover',
};

export function NeoButton({
  children,
  variant = 'primary',
  isLoading = false,
  className = '',
  disabled,
  ...props
}: NeoButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        px-6 py-3
        font-heading text-base font-bold uppercase tracking-wide
        border-3 border-text
        shadow-neo
        transition-all duration-100 ease-in-out
        hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-sm
        active:translate-x-[4px] active:translate-y-[4px] active:shadow-neo-none
        disabled:opacity-50 disabled:cursor-not-allowed
        disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-neo
        cursor-pointer
        ${variantStyles[variant]}
        ${className}
      `}
      disabled={disabled ?? isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block h-5 w-5 animate-spin rounded-full border-3 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
}
