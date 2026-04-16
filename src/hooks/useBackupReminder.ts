'use client';

import { useState, useEffect } from 'react';
import { usePollinatorStore } from '@/store/usePollinatorStore';

const BACKUP_STORAGE_KEY = 'pollinators-last-backup';
const BACKUP_COUNT_KEY = 'pollinators-count-at-backup';
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const ADD_THRESHOLD = 5;

export function useBackupReminder() {
  const pollinators = usePollinatorStore((s) => s.pollinators);
  const [shouldRemind, setShouldRemind] = useState(false);

  useEffect(() => {
    if (pollinators.length === 0) {
      setShouldRemind(false);
      return;
    }

    const lastBackup = localStorage.getItem(BACKUP_STORAGE_KEY);
    const countAtBackup = parseInt(localStorage.getItem(BACKUP_COUNT_KEY) || '0', 10);

    const timeSinceBackup = lastBackup
      ? Date.now() - new Date(lastBackup).getTime()
      : Infinity;

    const newSinceBackup = pollinators.length - countAtBackup;

    if (timeSinceBackup > SEVEN_DAYS_MS || newSinceBackup >= ADD_THRESHOLD) {
      setShouldRemind(true);
    }
  }, [pollinators.length]);

  const markBackedUp = () => {
    localStorage.setItem(BACKUP_STORAGE_KEY, new Date().toISOString());
    localStorage.setItem(BACKUP_COUNT_KEY, String(pollinators.length));
    setShouldRemind(false);
  };

  const dismiss = () => setShouldRemind(false);

  return { shouldRemind, markBackedUp, dismiss };
}
