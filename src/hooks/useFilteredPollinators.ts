'use client';

import { useMemo } from 'react';
import { usePollinatorStore } from '@/store/usePollinatorStore';
import { useUIStore } from '@/store/useUIStore';
import type { Pollinator } from '@/types/pollinator';
import { isAwaitingStory } from '@/lib/completeness';

export function useFilteredPollinators(): Pollinator[] {
  const pollinators = usePollinatorStore((s) => s.pollinators);
  const searchQuery = useUIStore((s) => s.searchQuery);
  const sortBy = useUIStore((s) => s.sortBy);
  const filters = useUIStore((s) => s.filters);

  return useMemo(() => {
    let result = [...pollinators];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.organization?.toLowerCase().includes(q) ||
          p.currentPursuit.toLowerCase().includes(q) ||
          p.whyTheyMatter.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Filter by tier
    if (filters.tiers.length > 0) {
      result = result.filter((p) => filters.tiers.includes(p.tier));
    }

    // Filter by reciprocity
    if (filters.reciprocity.length > 0) {
      result = result.filter((p) => filters.reciprocity.includes(p.reciprocityState));
    }

    // Filter by trust range
    result = result.filter(
      (p) => p.trustLevel >= filters.trustMin && p.trustLevel <= filters.trustMax
    );

    // Filter by tags
    if (filters.tags.length > 0) {
      result = result.filter((p) =>
        filters.tags.some((t) => p.tags.includes(t))
      );
    }

    // Filter by awaiting story
    if (filters.awaitingStory) {
      result = result.filter((p) => isAwaitingStory(p));
    }

    // Sort
    switch (sortBy) {
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'last-contact':
        result.sort((a, b) => {
          if (!a.lastContact && !b.lastContact) return 0;
          if (!a.lastContact) return 1;
          if (!b.lastContact) return -1;
          return new Date(b.lastContact).getTime() - new Date(a.lastContact).getTime();
        });
        break;
      case 'trust-high':
        result.sort((a, b) => b.trustLevel - a.trustLevel);
        break;
      case 'date-added':
        result.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
        break;
    }

    return result;
  }, [pollinators, searchQuery, sortBy, filters]);
}
