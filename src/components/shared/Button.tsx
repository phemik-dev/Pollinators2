'use client';

import { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: 'sm' | 'md';
}

const variants: Record<Variant, string> = {
  primary:
    'bg-ember text-white hover:bg-ember-hover shadow-sm hover:shadow-[var(--shadow-ember)] active:scale-[0.98]',
  secondary:
    'border border-[var(--border-default)] text-[var(--text-primary)] hover:border-ember hover:text-ember',
  ghost:
    'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-light)]',
  danger:
    'border border-[var(--border-default)] text-[var(--text-secondary)] hover:border-red-400 hover:text-red-500',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-[13px]',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        font-body font-bold uppercase tracking-[0.07em]
        rounded-[var(--radius-button)] transition-all duration-150
        disabled:opacity-50 disabled:pointer-events-none
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
