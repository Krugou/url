import type { ButtonHTMLAttributes, ReactNode } from 'react';

type NeoButtonVariant = 'primary' | 'secondary' | 'accent';

interface NeoButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: NeoButtonVariant;
  isLoading?: boolean;
}

const variantStyles: Record<NeoButtonVariant, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-hover hover:shadow-indigo-500/25',
  secondary:
    'bg-secondary text-white hover:bg-secondary-hover hover:shadow-emerald-500/25',
  accent:
    'bg-accent text-white hover:bg-accent-hover hover:shadow-amber-500/25',
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
        font-heading text-base font-semibold tracking-wide
        rounded-xl
        border border-transparent
        shadow-neo-sm
        transition-all duration-200 ease-in-out
        hover:-translate-y-0.5 hover:shadow-neo
        active:translate-y-0 active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed
        disabled:hover:translate-y-0 disabled:hover:shadow-neo-sm disabled:active:scale-100
        cursor-pointer
        ${variantStyles[variant]}
        ${className}
      `}
      disabled={disabled ?? isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
}
