'use client';

import type { Pollinator } from '@/types/pollinator';
import { TrustStars } from '@/components/shared/TrustStars';
import { ReciprocityDot } from '@/components/shared/ReciprocityDot';
import { TagBadge } from '@/components/shared/TagBadge';
import { formatRelative } from '@/lib/dates';
import { useUIStore } from '@/store/useUIStore';

interface PersonCardProps {
  pollinator: Pollinator;
}

export function PersonCard({ pollinator }: PersonCardProps) {
  const selectPollinator = useUIStore((s) => s.selectPollinator);

  const lastInteraction = pollinator.interactions.length > 0
    ? [...pollinator.interactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0]
    : null;

  return (
    <button
      onClick={() => selectPollinator(pollinator.id)}
      className="
        w-full text-left
        bg-[var(--bg-secondary)] rounded-[var(--radius-card)]
        border border-[var(--border-default)]
        p-4 sm:p-5
        shadow-[var(--shadow-card)]
        hover:shadow-[var(--shadow-lift)] hover:-translate-y-0.5
        transition-all duration-200
        cursor-pointer group
      "
    >
      {/* Top row: Name + Reciprocity */}
      <div className="flex items-start justify-between mb-1.5">
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-lg sm:text-xl font-bold text-[var(--text-primary)] truncate group-hover:text-ember transition-colors">
            {pollinator.name}
          </h3>
          {(pollinator.organization || pollinator.role) && (
            <p className="text-xs font-body text-[var(--text-secondary)] truncate">
              {[pollinator.role, pollinator.organization].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
        <ReciprocityDot state={pollinator.reciprocityState} />
      </div>

      {/* Current pursuit */}
      <p className="text-sm font-display italic text-[var(--text-secondary)] mb-2 line-clamp-2">
        {pollinator.currentPursuit}
      </p>

      {/* Last interaction */}
      {lastInteraction && (
        <p className="text-xs font-body text-[var(--text-soft)] mb-2 truncate">
          <span className="capitalize">{lastInteraction.type}</span>
          {' · '}
          {pollinator.lastContact && formatRelative(pollinator.lastContact)}
          {lastInteraction.summary && ` — ${lastInteraction.summary}`}
        </p>
      )}

      {/* Trust + Tags row */}
      <div className="flex items-center justify-between mt-2 gap-2">
        <div className="flex items-center gap-2">
          <TrustStars level={pollinator.trustLevel} size="sm" />
          {pollinator.trustNote && (
            <span className="text-[10px] font-body text-[var(--text-soft)] truncate max-w-[120px]" title={pollinator.trustNote}>
              {pollinator.trustNote}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 overflow-hidden">
          {pollinator.tags.slice(0, 3).map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
          {pollinator.tags.length > 3 && (
            <span className="text-[9px] font-mono text-[var(--text-soft)]">
              +{pollinator.tags.length - 3}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
