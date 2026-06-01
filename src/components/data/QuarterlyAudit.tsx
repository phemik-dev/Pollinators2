'use client';

import { useGentleNudges } from '@/hooks/useGentleNudges';
import { useQuarterlyAudit } from '@/hooks/useQuarterlyAudit';

export function QuarterlyAudit() {
  const { nudges } = useGentleNudges();
  const { showAudit, dismiss, reviewNow } = useQuarterlyAudit(nudges.length);

  if (!showAudit) return null;

  return (
    <div
      className="
        fixed bottom-4 left-4 z-40
        max-w-sm p-4
        rounded-[var(--radius-card)]
        shadow-[var(--shadow-lift)]
        font-body text-sm
      "
      style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-default)',
      }}
    >
      <div className="flex items-start gap-3">
        <span className="text-lg shrink-0" style={{ color: 'var(--color-solar)' }}>◇</span>
        <div className="flex-1">
          <p
            className="font-medium mb-1"
            style={{ color: 'var(--text-primary)' }}
          >
            A season has passed
          </p>
          <p
            className="text-xs mb-3"
            style={{ color: 'var(--text-secondary)' }}
          >
            Would you like to glance over your active constellation and see
            what&apos;s changed?
          </p>
          <div className="flex gap-2">
            <button
              onClick={reviewNow}
              className="px-3 py-1 text-xs font-bold uppercase tracking-[0.07em] rounded-[var(--radius-button)] transition-colors"
              style={{
                backgroundColor: 'var(--color-solar)',
                color: 'var(--color-ink)',
              }}
            >
              Review now
            </button>
            <button
              onClick={dismiss}
              className="px-3 py-1 text-xs transition-colors"
              style={{ color: 'var(--text-soft)' }}
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
