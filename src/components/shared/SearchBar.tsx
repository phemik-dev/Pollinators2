'use client';

import { useUIStore } from '@/store/useUIStore';
import { useEffect, useState } from 'react';

export function SearchBar() {
  const setSearchQuery = useUIStore((s) => s.setSearchQuery);
  const [local, setLocal] = useState('');

  // Debounce search by 200ms
  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(local), 200);
    return () => clearTimeout(timer);
  }, [local, setSearchQuery]);

  return (
    <div className="relative flex-1 max-w-md">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-soft)]"
        width="16" height="16" viewBox="0 0 16 16" fill="none"
      >
        <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M11 11L14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <input
        type="text"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder="Search our constellation..."
        className="
          w-full pl-9 pr-3 py-2 text-sm font-body
          bg-[var(--bg-secondary)] text-[var(--text-primary)]
          border border-[var(--border-default)]
          rounded-[var(--radius-card)]
          placeholder:text-[var(--text-soft)]
          focus:border-ember focus:ring-1 focus:ring-ember/30
          transition-colors duration-150
        "
      />
      {local && (
        <button
          onClick={() => { setLocal(''); setSearchQuery(''); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-soft)] hover:text-[var(--text-primary)]"
          aria-label="Clear search"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
