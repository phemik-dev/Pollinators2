'use client';

import { useMemo } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { usePollinatorStore } from '@/store/usePollinatorStore';
import { Select } from './Select';
import { Button } from './Button';
import type { Tier, ReciprocityState, TrustLevel } from '@/types/pollinator';
import type { SortOption } from '@/types/filters';

export function FilterPanel() {
  const showFilters = useUIStore((s) => s.showFilters);
  const filters = useUIStore((s) => s.filters);
  const setFilters = useUIStore((s) => s.setFilters);
  const resetFilters = useUIStore((s) => s.resetFilters);
  const sortBy = useUIStore((s) => s.sortBy);
  const setSortBy = useUIStore((s) => s.setSortBy);

  // Collect all existing tags for the filter — memoized to avoid infinite loop
  const pollinators = usePollinatorStore((s) => s.pollinators);
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    pollinators.forEach((p) => p.tags.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [pollinators]);

  if (!showFilters) return null;

  const toggleTier = (tier: Tier) => {
    const tiers = filters.tiers.includes(tier)
      ? filters.tiers.filter((t) => t !== tier)
      : [...filters.tiers, tier];
    setFilters({ ...filters, tiers });
  };

  const toggleReciprocity = (state: ReciprocityState) => {
    const reciprocity = filters.reciprocity.includes(state)
      ? filters.reciprocity.filter((r) => r !== state)
      : [...filters.reciprocity, state];
    setFilters({ ...filters, reciprocity });
  };

  const toggleTag = (tag: string) => {
    const tags = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag];
    setFilters({ ...filters, tags });
  };

  const chipClass = (active: boolean) =>
    `px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.14em] rounded-[var(--radius-pill)] border transition-colors cursor-pointer ${
      active
        ? 'bg-ember/10 border-ember/30 text-ember'
        : 'bg-transparent border-[var(--border-default)] text-[var(--text-soft)] hover:border-ember/20'
    }`;

  return (
    <div className="mb-4 p-4 rounded-[var(--radius-feature)] bg-[var(--bg-secondary)] border border-[var(--border-default)] space-y-4">
      {/* Sort */}
      <Select
        label="Sort by"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as SortOption)}
        options={[
          { value: 'name-asc', label: 'Name (A-Z)' },
          { value: 'last-contact', label: 'Last contact' },
          { value: 'trust-high', label: 'Trust (highest)' },
          { value: 'date-added', label: 'Recently added' },
        ]}
      />

      {/* Tier filter */}
      <div>
        <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-[var(--text-soft)] mb-2">Circle</p>
        <div className="flex flex-wrap gap-2">
          {(['active', 'warm', 'dormant'] as Tier[]).map((tier) => (
            <button key={tier} onClick={() => toggleTier(tier)} className={chipClass(filters.tiers.includes(tier))}>
              {tier === 'active' ? 'Active' : tier === 'warm' ? 'Warm' : 'Resting'}
            </button>
          ))}
        </div>
      </div>

      {/* Reciprocity filter */}
      <div>
        <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-[var(--text-soft)] mb-2">Flow</p>
        <div className="flex flex-wrap gap-2">
          {(['your-turn', 'their-turn', 'balanced'] as ReciprocityState[]).map((state) => (
            <button key={state} onClick={() => toggleReciprocity(state)} className={chipClass(filters.reciprocity.includes(state))}>
              {state === 'your-turn' ? 'Your turn' : state === 'their-turn' ? 'Their turn' : 'Balanced'}
            </button>
          ))}
        </div>
      </div>

      {/* Trust range */}
      <div>
        <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-[var(--text-soft)] mb-2">
          Trust range: {filters.trustMin} — {filters.trustMax}
        </p>
        <div className="flex items-center gap-3">
          <input
            type="range" min="1" max="5" step="1"
            value={filters.trustMin}
            onChange={(e) => setFilters({ ...filters, trustMin: Number(e.target.value) as TrustLevel })}
            className="flex-1 accent-ember"
          />
          <span className="text-xs font-mono text-[var(--text-soft)]">to</span>
          <input
            type="range" min="1" max="5" step="1"
            value={filters.trustMax}
            onChange={(e) => setFilters({ ...filters, trustMax: Number(e.target.value) as TrustLevel })}
            className="flex-1 accent-ember"
          />
        </div>
      </div>

      {/* Awaiting story filter */}
      <div>
        <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-[var(--text-soft)] mb-2">Completeness</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilters({ ...filters, awaitingStory: !filters.awaitingStory })}
            className={chipClass(filters.awaitingStory)}
          >
            Awaiting story
          </button>
        </div>
      </div>

      {/* Tags filter */}
      {allTags.length > 0 && (
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-[var(--text-soft)] mb-2">Tags</p>
          <div className="flex flex-wrap gap-1.5">
            {allTags.map((tag) => (
              <button key={tag} onClick={() => toggleTag(tag)} className={chipClass(filters.tags.includes(tag))}>
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button variant="ghost" size="sm" onClick={resetFilters}>
          Clear All Filters
        </Button>
      </div>
    </div>
  );
}
