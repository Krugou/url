import { forwardRef, type InputHTMLAttributes } from 'react';

interface NeoInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const NeoInput = forwardRef<HTMLInputElement, NeoInputProps>(
  function NeoInput({ label, error, className = '', id, ...props }, ref) {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label ? (
          <label
            htmlFor={inputId}
            className="font-body text-sm font-semibold tracking-wide text-slate-700"
          >
            {label}
          </label>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-3
            bg-white text-slate-900
            border border-slate-200
            rounded-xl
            shadow-neo-sm
            font-body text-base
            placeholder:text-slate-400
            focus:border-primary focus:ring-3 focus:ring-primary/10 focus:outline-none
            transition-all duration-200
            ${error ? 'border-error focus:border-error focus:ring-error/10' : ''}
            ${className}
          `}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error && inputId ? `${inputId}-error` : undefined}
          {...props}
        />
        {error ? (
          <p
            id={inputId ? `${inputId}-error` : undefined}
            className="text-sm font-medium text-error"
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);
