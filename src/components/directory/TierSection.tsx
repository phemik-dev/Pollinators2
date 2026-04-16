'use client';

import { useState } from 'react';
import type { Tier, Pollinator } from '@/types/pollinator';
import { PersonCard } from './PersonCard';

interface TierSectionProps {
  tier: Tier;
  pollinators: Pollinator[];
  defaultOpen?: boolean;
}

const tierConfig: Record<Tier, { label: string; description: string; accent: string; icon: string }> = {
  active: {
    label: 'Active constellation',
    description: 'Inner circle — weekly rhythm',
    accent: 'text-grove-light border-grove-light/30',
    icon: '●',
  },
  warm: {
    label: 'Warm connections',
    description: 'Monthly rhythm',
    accent: 'text-solar border-solar/30',
    icon: '◐',
  },
  dormant: {
    label: 'Resting bonds',
    description: 'Valuable but dormant',
    accent: 'text-midnight-600 border-midnight-600/30',
    icon: '○',
  },
};

export function TierSection({ tier, pollinators, defaultOpen = false }: TierSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const config = tierConfig[tier];

  if (pollinators.length === 0) return null;

  return (
    <section className="mb-4">
      <button
        onClick={() => setOpen(!open)}
        className={`
          w-full flex items-center justify-between
          px-4 py-3 rounded-[var(--radius-feature)]
          border ${config.accent}
          bg-[var(--bg-secondary)]/50
          hover:bg-[var(--bg-secondary)]
          transition-colors duration-150
          group
        `}
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <span className={`text-sm ${config.accent.split(' ')[0]}`}>{config.icon}</span>
          <div className="text-left">
            <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-[var(--text-soft)]">
              {config.label}
            </span>
            <span className="ml-2 text-[10px] font-mono text-[var(--text-soft)]">
              ({pollinators.length})
            </span>
          </div>
        </div>
        <svg
          width="16" height="16" viewBox="0 0 16 16" fill="none"
          className={`text-[var(--text-soft)] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <div className="tier-content" data-open={open}>
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-3">
            {pollinators.map((p) => (
              <PersonCard key={p.id} pollinator={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
