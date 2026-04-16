'use client';

import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea({ label, error, className = '', id, ...props }, ref) {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-[var(--text-secondary)] font-body"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`
            w-full px-3 py-2.5 text-sm font-body
            bg-[var(--bg-secondary)] text-[var(--text-primary)]
            border border-[var(--border-default)]
            rounded-[var(--radius-tag)]
            placeholder:text-[var(--text-soft)]
            focus:border-ember focus:ring-1 focus:ring-ember/30
            transition-colors duration-150 resize-y min-h-[80px]
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
