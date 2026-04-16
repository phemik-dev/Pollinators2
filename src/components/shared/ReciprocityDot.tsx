'use client';

import type { ReciprocityState } from '@/types/pollinator';

interface ReciprocityDotProps {
  state: ReciprocityState;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

/**
 * Reciprocity indicator — Ubuntu-aligned, NO red.
 * Solar gold = your turn (warm invitation)
 * Grove green = their turn (the ball rests peacefully)
 * Cream/neutral = balanced (all is well)
 */
const config: Record<ReciprocityState, { color: string; glow: string; label: string }> = {
  'your-turn': {
    color: 'bg-solar',
    glow: 'shadow-[0_0_8px_rgba(240,192,64,0.5)]',
    label: 'Your turn to reach out',
  },
  'their-turn': {
    color: 'bg-grove-light',
    glow: 'shadow-[0_0_8px_rgba(107,191,142,0.4)]',
    label: 'The ball is in their court',
  },
  balanced: {
    color: 'bg-haze',
    glow: '',
    label: 'Balanced',
  },
};

export function ReciprocityDot({ state, showLabel = false, size = 'md' }: ReciprocityDotProps) {
  const { color, glow, label } = config[state];
  const dotSize = size === 'sm' ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5';

  return (
    <div className="inline-flex items-center gap-2" title={label}>
      <span className={`${dotSize} rounded-full ${color} ${glow} shrink-0`} />
      {showLabel && (
        <span className="text-xs font-body text-[var(--text-secondary)]">{label}</span>
      )}
    </div>
  );
}
