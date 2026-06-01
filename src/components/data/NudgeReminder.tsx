'use client';

import { useGentleNudges } from '@/hooks/useGentleNudges';
import { useUIStore } from '@/store/useUIStore';

export function NudgeReminder() {
  const { nudges, snooze, markBalanced } = useGentleNudges();
  const selectPollinator = useUIStore((s) => s.selectPollinator);

  if (nudges.length === 0) return null;

  // Show one at a time — the first in the list
  const current = nudges[0];

  const sortedInteractions = [...current.interactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const lastInteraction = sortedInteractions[0] ?? null;

  const handleReconnect = () => {
    selectPollinator(current.id);
  };

  return (
    <div
      className="
        fixed bottom-4 right-4 z-40
        max-w-sm p-4
        rounded-[var(--radius-card)]
        shadow-[var(--shadow-lift)]
        font-body text-sm
      "
      style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-default)',
        bottom: '6rem', // offset above BackupReminder
      }}
    >
      <div className="flex items-start gap-3">
        <span className="text-lg shrink-0" style={{ color: 'var(--color-solar)' }}>✦</span>
        <div className="flex-1">
          <p
            className="font-medium mb-1"
            style={{ color: 'var(--text-primary)' }}
          >
            {current.name}
          </p>
          <p
            className="text-xs mb-1"
            style={{ color: 'var(--text-secondary)' }}
          >
            It&apos;s been a little while since you and{' '}
            <span className="font-medium">{current.name}</span> connected.
            Ready to reach out?
          </p>
          {lastInteraction && (
            <p
              className="text-[11px] italic mb-3"
              style={{ color: 'var(--text-soft)' }}
            >
              Last: {lastInteraction.summary}
            </p>
          )}
          {nudges.length > 1 && (
            <p
              className="text-[10px] font-mono uppercase tracking-[0.1em] mb-3"
              style={{ color: 'var(--text-soft)' }}
            >
              {nudges.length - 1} more waiting
            </p>
          )}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleReconnect}
              className="px-3 py-1 text-xs font-bold uppercase tracking-[0.07em] rounded-[var(--radius-button)] transition-colors"
              style={{
                backgroundColor: 'var(--color-solar)',
                color: 'var(--color-ink)',
              }}
            >
              Reconnect
            </button>
            <button
              onClick={() => snooze(current.id)}
              className="px-3 py-1 text-xs transition-colors"
              style={{ color: 'var(--text-soft)' }}
            >
              Not yet
            </button>
            <button
              onClick={() => markBalanced(current.id)}
              className="px-3 py-1 text-xs transition-colors"
              style={{ color: 'var(--color-grove-mid)' }}
            >
              Mark balanced
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
