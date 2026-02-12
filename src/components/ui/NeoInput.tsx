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
            className="font-heading text-sm font-bold uppercase tracking-wide text-text"
          >
            {label}
          </label>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-3
            bg-bg-main text-text
            border-3 border-text
            shadow-neo-sm
            font-body text-base
            placeholder:text-text/40
            focus:shadow-neo focus:outline-none
            transition-shadow duration-100
            ${error ? 'border-error' : ''}
            ${className}
          `}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error && inputId ? `${inputId}-error` : undefined}
          {...props}
        />
        {error ? (
          <p
            id={inputId ? `${inputId}-error` : undefined}
            className="text-sm font-bold text-error"
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
