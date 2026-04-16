'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ label, error, className = '', id, ...props }, ref) {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[var(--text-secondary)] font-body"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-3 py-2.5 text-sm font-body
            bg-[var(--bg-secondary)] text-[var(--text-primary)]
            border border-[var(--border-default)]
            rounded-[var(--radius-tag)]
            placeholder:text-[var(--text-soft)]
            focus:border-ember focus:ring-1 focus:ring-ember/30
            transition-colors duration-150
            ${error ? 'border-red-400' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <span className="text-xs text-red-500 font-body">{error}</span>}
      </div>
    );
  }
);
