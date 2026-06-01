'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePollinatorStore } from '@/store/usePollinatorStore';
import { useUIStore } from '@/store/useUIStore';
import { DEFAULT_FILTERS } from '@/types/filters';

const AUDIT_KEY = 'pollinators-last-audit-v1';
const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;
const ACTIVE_THRESHOLD = 3;

export function useQuarterlyAudit(nudgesCount: number): {
  showAudit: boolean;
  dismiss: () => void;
  reviewNow: () => void;
} {
  const pollinators = usePollinatorStore((s) => s.pollinators);
  const setFilters = useUIStore((s) => s.setFilters);
  const toggleFilters = useUIStore((s) => s.toggleFilters);
  const showFilters = useUIStore((s) => s.showFilters);
  const [dismissed, setDismissed] = useState(false);
  const [overdue, setOverdue] = useState(false);

  useEffect(() => {
    const lastAudit = localStorage.getItem(AUDIT_KEY);
    const timeSince = lastAudit
      ? Date.now() - new Date(lastAudit).getTime()
      : Infinity;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOverdue(timeSince > NINETY_DAYS_MS);
  }, []);

  const activeCount = pollinators.filter((p) => p.tier === 'active').length;
  const showAudit =
    overdue &&
    !dismissed &&
    nudgesCount === 0 &&
    activeCount >= ACTIVE_THRESHOLD;

  const dismiss = useCallback(() => {
    localStorage.setItem(AUDIT_KEY, new Date().toISOString());
    setDismissed(true);
  }, []);

  const reviewNow = useCallback(() => {
    setFilters({ ...DEFAULT_FILTERS, tiers: ['active'] });
    // Open filter panel if not already open
    if (!showFilters) {
      toggleFilters();
    }
    localStorage.setItem(AUDIT_KEY, new Date().toISOString());
    setDismissed(true);
  }, [setFilters, toggleFilters, showFilters]);

  return { showAudit, dismiss, reviewNow };
}
