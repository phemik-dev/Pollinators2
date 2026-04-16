'use client';

import { useBackupReminder } from '@/hooks/useBackupReminder';
import { usePollinatorStore } from '@/store/usePollinatorStore';
import { exportToJSON } from '@/lib/export';

export function BackupReminder() {
  const { shouldRemind, markBackedUp, dismiss } = useBackupReminder();
  const pollinators = usePollinatorStore((s) => s.pollinators);

  if (!shouldRemind) return null;

  const handleExport = () => {
    exportToJSON(pollinators);
    markBackedUp();
  };

  return (
    <div className="
      fixed bottom-4 right-4 z-40
      max-w-sm p-4
      bg-solar-pale border border-solar/20
      rounded-[var(--radius-card)]
      shadow-[var(--shadow-lift)]
      font-body text-sm
    ">
      <div className="flex items-start gap-3">
        <span className="text-lg shrink-0">🌿</span>
        <div className="flex-1">
          <p className="font-medium text-ink mb-1">
            Your constellation has grown
          </p>
          <p className="text-xs text-ink/60 mb-3">
            Would you like to save a copy? It&apos;s good practice to keep a backup of your connections.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="px-3 py-1 text-xs font-bold uppercase tracking-[0.07em] bg-ember text-white rounded-[var(--radius-button)] hover:bg-ember-hover transition-colors"
            >
              Export
            </button>
            <button
              onClick={dismiss}
              className="px-3 py-1 text-xs text-ink/50 hover:text-ink transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
