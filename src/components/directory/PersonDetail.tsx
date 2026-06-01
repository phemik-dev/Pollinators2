'use client';

import { useUIStore } from '@/store/useUIStore';
import { usePollinatorStore } from '@/store/usePollinatorStore';
import { TrustStars } from '@/components/shared/TrustStars';
import { ReciprocityDot } from '@/components/shared/ReciprocityDot';
import { TagBadge } from '@/components/shared/TagBadge';
import { Button } from '@/components/shared/Button';
import { formatShort } from '@/lib/dates';
import { isAwaitingStory } from '@/lib/completeness';

const interactionIcons: Record<string, string> = {
  call: '📞',
  email: '✉️',
  meeting: '🤝',
  conference: '🎤',
};

const tierLabels: Record<string, string> = {
  active: 'Active constellation',
  warm: 'Warm connection',
  dormant: 'Resting bond',
};

export function PersonDetail() {
  const selectedId = useUIStore((s) => s.selectedPollinatorId);
  const selectPollinator = useUIStore((s) => s.selectPollinator);
  const setOpenModal = useUIStore((s) => s.setOpenModal);
  const pollinator = usePollinatorStore((s) =>
    s.pollinators.find((p) => p.id === selectedId)
  );

  if (!selectedId || !pollinator) return null;

  const sortedInteractions = [...pollinator.interactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-midnight/40 backdrop-blur-sm"
        onClick={() => selectPollinator(null)}
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[var(--bg-primary)] border-l border-[var(--border-default)] shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[var(--bg-primary)]/95 backdrop-blur-sm border-b border-[var(--border-default)] p-4 flex items-center justify-between">
          <button
            onClick={() => selectPollinator(null)}
            className="p-1.5 text-[var(--text-soft)] hover:text-[var(--text-primary)] transition-colors"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setOpenModal('edit')}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setOpenModal('delete')}
            >
              Release
            </Button>
          </div>
        </div>

        <div className="p-5 space-y-6">
          {/* Identity */}
          <div>
            <div className="flex items-start justify-between mb-1">
              <h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">
                {pollinator.name}
              </h2>
              <ReciprocityDot state={pollinator.reciprocityState} showLabel />
            </div>
            {(pollinator.organization || pollinator.role) && (
              <p className="text-sm font-body text-[var(--text-secondary)]">
                {[pollinator.role, pollinator.organization].filter(Boolean).join(' at ')}
              </p>
            )}
            <span className="inline-block mt-2 text-[9px] font-mono uppercase tracking-[0.18em] px-2 py-0.5 rounded-[var(--radius-pill)] bg-[var(--border-light)] text-[var(--text-soft)]">
              {tierLabels[pollinator.tier]}
            </span>
          </div>

          {/* What they carry */}
          <div>
            <h3 className="text-[10px] font-mono uppercase tracking-[0.28em] text-ember mb-2">
              What They Carry
            </h3>
            {isAwaitingStory(pollinator) ? (
              <p className="text-sm font-body italic" style={{ color: 'var(--text-soft)' }}>
                You haven&apos;t yet captured what {pollinator.name} is working on.{' '}
                <button
                  onClick={() => setOpenModal('edit')}
                  className="underline underline-offset-2 transition-colors hover:opacity-80"
                  style={{ color: 'var(--color-solar)' }}
                >
                  Add their story?
                </button>
              </p>
            ) : (
              <p className="text-sm font-display italic text-[var(--text-primary)] leading-relaxed">
                {pollinator.currentPursuit}
              </p>
            )}
          </div>

          {/* Why they matter */}
          {pollinator.whyTheyMatter && (
            <div>
              <h3 className="text-[10px] font-mono uppercase tracking-[0.28em] text-ember mb-2">
                Why They Matter to Our Work
              </h3>
              <p className="text-sm font-body text-[var(--text-secondary)] leading-relaxed">
                {pollinator.whyTheyMatter}
              </p>
            </div>
          )}

          {/* Trust */}
          <div>
            <h3 className="text-[10px] font-mono uppercase tracking-[0.28em] text-ember mb-2">
              Trust
            </h3>
            <div className="flex items-center gap-3">
              <TrustStars level={pollinator.trustLevel} />
              {pollinator.trustNote && (
                <span className="text-xs font-body text-[var(--text-soft)] italic">
                  {pollinator.trustNote}
                </span>
              )}
            </div>
          </div>

          {/* Tags */}
          {pollinator.tags.length > 0 && (
            <div>
              <h3 className="text-[10px] font-mono uppercase tracking-[0.28em] text-ember mb-2">
                Expertise
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {pollinator.tags.map((tag) => (
                  <TagBadge key={tag} tag={tag} />
                ))}
              </div>
            </div>
          )}

          {/* Contact info */}
          {(pollinator.contactInfo.email || pollinator.contactInfo.phone || pollinator.contactInfo.linkedin) && (
            <div>
              <h3 className="text-[10px] font-mono uppercase tracking-[0.28em] text-ember mb-2">
                Reach Out
              </h3>
              <div className="space-y-1 text-sm font-body text-[var(--text-secondary)]">
                {pollinator.contactInfo.email && (
                  <p>
                    <span className="text-[var(--text-soft)]">Email:</span>{' '}
                    <a href={`mailto:${pollinator.contactInfo.email}`} className="hover:text-ember transition-colors">
                      {pollinator.contactInfo.email}
                    </a>
                  </p>
                )}
                {pollinator.contactInfo.phone && (
                  <p>
                    <span className="text-[var(--text-soft)]">Phone:</span>{' '}
                    {pollinator.contactInfo.phone}
                  </p>
                )}
                {pollinator.contactInfo.linkedin && (
                  <p>
                    <span className="text-[var(--text-soft)]">LinkedIn:</span>{' '}
                    <a href={pollinator.contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-ember transition-colors">
                      Profile
                    </a>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Log interaction CTA */}
          <Button
            variant="primary"
            className="w-full"
            onClick={() => setOpenModal('interaction')}
          >
            Record a Moment of Exchange
          </Button>

          {/* Interaction timeline */}
          <div>
            <h3 className="text-[10px] font-mono uppercase tracking-[0.28em] text-ember mb-3">
              Exchange History
            </h3>
            {sortedInteractions.length === 0 ? (
              <p className="text-sm font-body text-[var(--text-soft)] italic">
                No exchanges recorded yet. When you connect, record the moment here.
              </p>
            ) : (
              <div className="space-y-3">
                {sortedInteractions.map((ix) => (
                  <div
                    key={ix.id}
                    className="flex gap-3 p-3 rounded-[var(--radius-tag)] bg-[var(--bg-secondary)] border border-[var(--border-light)]"
                  >
                    <span className="text-base shrink-0 mt-0.5">{interactionIcons[ix.type] || '📌'}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-body font-medium capitalize text-[var(--text-primary)]">
                          {ix.type}
                        </span>
                        <span className="text-[10px] font-mono text-[var(--text-soft)]">
                          {formatShort(ix.date)}
                        </span>
                      </div>
                      <p className="text-xs font-body text-[var(--text-secondary)]">
                        {ix.summary}
                      </p>
                      <ReciprocityDot
                        state={
                          ix.reciprocity === 'i-owe-them' ? 'your-turn'
                            : ix.reciprocity === 'they-owe-me' ? 'their-turn'
                            : 'balanced'
                        }
                        showLabel
                        size="sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Added date */}
          <p className="text-[10px] font-mono text-[var(--text-soft)] text-center pt-4">
            Part of our constellation since {formatShort(pollinator.dateAdded)}
          </p>
        </div>
      </div>
    </>
  );
}
