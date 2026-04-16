'use client';

import { useUIStore } from '@/store/useUIStore';
import { Button } from '@/components/shared/Button';

interface EmptyStateProps {
  isFiltered?: boolean;
}

export function EmptyState({ isFiltered = false }: EmptyStateProps) {
  const setOpenModal = useUIStore((s) => s.setOpenModal);
  const resetFilters = useUIStore((s) => s.resetFilters);
  const setSearchQuery = useUIStore((s) => s.setSearchQuery);

  if (isFiltered) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="font-display text-xl text-[var(--text-secondary)] mb-2">
          No connections match these filters
        </p>
        <p className="text-sm font-body text-[var(--text-soft)] mb-6">
          Perhaps widen your gaze.
        </p>
        <Button
          variant="secondary"
          onClick={() => {
            resetFilters();
            setSearchQuery('');
          }}
        >
          Clear Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center px-4">
      {/* Constellation illustration */}
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" className="mb-8">
        {/* Connection lines */}
        <line x1="60" y1="50" x2="30" y2="30" stroke="#E8722A" strokeWidth="0.8" opacity="0.4"/>
        <line x1="60" y1="50" x2="90" y2="35" stroke="#F0C040" strokeWidth="0.8" opacity="0.4"/>
        <line x1="60" y1="50" x2="40" y2="80" stroke="#6BBF8E" strokeWidth="0.8" opacity="0.4"/>
        <line x1="60" y1="50" x2="85" y2="75" stroke="#E8722A" strokeWidth="0.8" opacity="0.4"/>
        <line x1="30" y1="30" x2="50" y2="20" stroke="#F0C040" strokeWidth="0.5" opacity="0.3"/>
        <line x1="90" y1="35" x2="100" y2="55" stroke="#6BBF8E" strokeWidth="0.5" opacity="0.3"/>

        {/* Center node — You */}
        <circle cx="60" cy="50" r="8" fill="#E8722A" opacity="0.9"/>
        <circle cx="60" cy="50" r="12" stroke="#E8722A" strokeWidth="0.5" opacity="0.3"/>

        {/* Satellite nodes */}
        <circle cx="30" cy="30" r="5" fill="#F0C040" opacity="0.7"/>
        <circle cx="90" cy="35" r="4" fill="#6BBF8E" opacity="0.7"/>
        <circle cx="40" cy="80" r="6" fill="#E8722A" opacity="0.5"/>
        <circle cx="85" cy="75" r="3" fill="#F0C040" opacity="0.6"/>
        <circle cx="50" cy="20" r="3" fill="#6BBF8E" opacity="0.5"/>
        <circle cx="100" cy="55" r="4" fill="#E8722A" opacity="0.4"/>

        {/* Orbit ring hint */}
        <circle cx="60" cy="50" r="35" stroke="#F0C040" strokeWidth="0.5" strokeDasharray="3 4" opacity="0.2"/>
      </svg>

      <h2 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-3">
        Your constellation <em className="text-ember">awaits</em>
      </h2>

      <p className="text-sm sm:text-base font-body text-[var(--text-secondary)] max-w-md mb-2 leading-relaxed">
        Every meaningful network begins with a single connection.
        Who comes to mind when you think of someone whose work has touched yours?
      </p>

      <p className="text-xs font-display italic text-[var(--text-soft)] mb-8">
        &ldquo;Motho ke motho ka batho ba bang&rdquo; &mdash; A person is a person through other people
      </p>

      <Button onClick={() => setOpenModal('add')}>
        Invite Your First Pollinator
      </Button>
    </div>
  );
}
