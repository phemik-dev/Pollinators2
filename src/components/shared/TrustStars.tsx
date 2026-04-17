'use client';

import type { TrustLevel } from '@/types/pollinator';

interface TrustStarsProps {
  level: TrustLevel;
  onChange?: (level: TrustLevel) => void;
  size?: 'sm' | 'md';
}

export function TrustStars({ level, onChange, size = 'md' }: TrustStarsProps) {
  const starSize = size === 'sm' ? 16 : 20;
  const interactive = !!onChange;

  return (
    <div className="inline-flex items-center gap-0.5" role={interactive ? 'radiogroup' : undefined} aria-label="Trust level">
      {([1, 2, 3, 4, 5] as TrustLevel[]).map((star) => {
        const starSvg = (
          <svg width={starSize} height={starSize} viewBox="0 0 20 20" fill="none">
            <path
              d="M10 1.5L12.47 6.93L18.5 7.63L14.01 11.64L15.18 17.5L10 14.58L4.82 17.5L5.99 11.64L1.5 7.63L7.53 6.93L10 1.5Z"
              fill={star <= level ? '#E8722A' : 'var(--border-default)'}
              stroke={star <= level ? '#E8722A' : 'var(--border-default)'}
              strokeWidth="0.5"
            />
          </svg>
        );

        if (interactive) {
          return (
            <button
              key={star}
              type="button"
              onClick={() => onChange?.(star)}
              className="cursor-pointer hover:scale-110 transition-transform duration-100"
              aria-label={`${star} star${star !== 1 ? 's' : ''}`}
              role="radio"
              aria-checked={star === level}
            >
              {starSvg}
            </button>
          );
        }

        // Read-only: use span to avoid nested button issues
        return (
          <span key={star} className="cursor-default" aria-hidden="true">
            {starSvg}
          </span>
        );
      })}
    </div>
  );
}
