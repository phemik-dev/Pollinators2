'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { usePollinatorStore } from '@/store/usePollinatorStore';
import type { Pollinator } from '@/types/pollinator';

const SNOOZE_KEY = 'pollinators-nudge-snooze-v1';
const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

type SnoozeMap = Record<string, string>; // id -> ISO date string

function readSnoozeMap(): SnoozeMap {
  try {
    const raw = localStorage.getItem(SNOOZE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as SnoozeMap;
  } catch {
    return {};
  }
}

function writeSnoozeMap(map: SnoozeMap): void {
  localStorage.setItem(SNOOZE_KEY, JSON.stringify(map));
}

function isSnoozed(id: string, snoozeMap: SnoozeMap, now: number): boolean {
  const ts = snoozeMap[id];
  if (!ts) return false;
  const age = now - new Date(ts).getTime();
  return age < SEVEN_DAYS_MS;
}

export function useGentleNudges(): {
  nudges: Pollinator[];
  snooze: (id: string) => void;
  markBalanced: (id: string) => void;
} {
  const pollinators = usePollinatorStore((s) => s.pollinators);
  const updatePollinator = usePollinatorStore((s) => s.updatePollinator);
  const [snoozeMap, setSnoozeMap] = useState<SnoozeMap>({});
  // Capture the current time once on mount so it is stable for this render cycle
  const [now] = useState(() => Date.now());

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSnoozeMap(readSnoozeMap());
  }, []);

  const nudges = useMemo(
    () =>
      pollinators.filter((p) => {
        if (p.reciprocityState !== 'your-turn') return false;
        if (!p.lastContact) {
          // No contact ever — treat as older than 14 days
          return !isSnoozed(p.id, snoozeMap, now);
        }
        const daysSince = now - new Date(p.lastContact).getTime();
        if (daysSince < FOURTEEN_DAYS_MS) return false;
        return !isSnoozed(p.id, snoozeMap, now);
      }),
    [pollinators, snoozeMap, now]
  );

  const snooze = useCallback((id: string) => {
    const updated = { ...readSnoozeMap(), [id]: new Date().toISOString() };
    writeSnoozeMap(updated);
    setSnoozeMap(updated);
  }, []);

  const markBalanced = useCallback((id: string) => {
    updatePollinator(id, { reciprocityState: 'balanced' });
  }, [updatePollinator]);

  return { nudges, snooze, markBalanced };
}
