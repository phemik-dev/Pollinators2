'use client';

import { useState, useRef, useEffect } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { usePollinatorStore } from '@/store/usePollinatorStore';
import { SearchBar } from '@/components/shared/SearchBar';
import { Button } from '@/components/shared/Button';
import { ThemeToggle } from './ThemeToggle';
import { exportToJSON, validateImport } from '@/lib/export';

export function Header() {
  const viewMode = useUIStore((s) => s.viewMode);
  const setViewMode = useUIStore((s) => s.setViewMode);
  const setOpenModal = useUIStore((s) => s.setOpenModal);
  const toggleFilters = useUIStore((s) => s.toggleFilters);
  const pollinators = usePollinatorStore((s) => s.pollinators);
  const importPollinators = usePollinatorStore((s) => s.importPollinators);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleExport = () => {
    exportToJSON(pollinators);
    setMenuOpen(false);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        const result = validateImport(data);
        if (result.pollinators.length === 0) { alert('No valid pollinators found in the file.'); return; }
        const mode = pollinators.length > 0
          ? confirm(`Found ${result.pollinators.length} connections.\n\nOK = Merge with existing\nCancel = Replace all`) ? 'merge' as const : 'replace' as const
          : 'replace' as const;
        importPollinators(result.pollinators, mode);
      } catch { alert('Could not read this file. Please use a valid JSON export.'); }
    };
    reader.readAsText(file);
    if (fileRef.current) fileRef.current.value = '';
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[var(--bg-primary)]/95 backdrop-blur-sm border-b border-[var(--border-default)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        {/* Top row: Title + actions */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* Hive Mark mini */}
            <svg width="28" height="28" viewBox="0 0 120 120" fill="none" className="shrink-0">
              <polygon points="60,26 75,34 75,50 60,58 45,50 45,34" fill="#E8722A"/>
              <polygon points="82,14 97,22 97,38 82,46 67,38 67,22" fill="rgba(232,114,42,0.40)"/>
              <polygon points="97,47 112,55 112,71 97,79 82,71 82,55" fill="rgba(107,191,142,0.55)"/>
              <polygon points="82,80 97,88 97,104 82,112 67,104 67,88" fill="rgba(240,192,64,0.45)"/>
              <polygon points="38,80 53,88 53,104 38,112 23,104 23,88" fill="rgba(232,114,42,0.30)"/>
              <polygon points="23,47 38,55 38,71 23,79 8,71 8,55" fill="rgba(240,192,64,0.30)"/>
              <polygon points="38,14 53,22 53,38 38,46 23,38 23,22" fill="rgba(107,191,142,0.35)"/>
            </svg>
            <div>
              <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight">
                <span className="text-[var(--text-primary)]">Pollin</span>
                <span className="italic text-ember">ators</span>
              </h1>
              <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-[var(--text-soft)] hidden sm:block">
                Living Directory
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* More options menu (Export / Import) */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                aria-label="More options"
                className="p-1.5 rounded-[var(--radius-tag)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="4" r="1.5" fill="currentColor"/>
                  <circle cx="9" cy="9" r="1.5" fill="currentColor"/>
                  <circle cx="9" cy="14" r="1.5" fill="currentColor"/>
                </svg>
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-1 w-40 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-[var(--radius-feature)] shadow-lg z-50 py-1 overflow-hidden">
                  <button
                    onClick={handleExport}
                    disabled={pollinators.length === 0}
                    className="w-full text-left px-4 py-2.5 text-xs font-body text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1v8M3 6l3.5 3.5L10 6M1 11h11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Export JSON
                  </button>
                  <label className="w-full text-left px-4 py-2.5 text-xs font-body text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors flex items-center gap-2 cursor-pointer">
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 9V1M3 4l3.5-3.5L10 4M1 11h11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Import JSON
                    <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden"/>
                  </label>
                </div>
              )}
            </div>

            <ThemeToggle />

            {/* View toggle */}
            <div className="flex bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-[var(--radius-tag)] overflow-hidden">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 text-xs font-body font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-ember text-white'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
                aria-label="List view"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 3h10M2 7h10M2 11h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
              <button
                onClick={() => setViewMode('galaxy')}
                className={`px-3 py-1.5 text-xs font-body font-medium transition-colors ${
                  viewMode === 'galaxy'
                    ? 'bg-ember text-white'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
                aria-label="Galaxy view"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="2" fill="currentColor"/>
                  <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2"/>
                  <circle cx="3" cy="4" r="1" fill="currentColor" opacity="0.6"/>
                  <circle cx="11" cy="6" r="1" fill="currentColor" opacity="0.6"/>
                  <circle cx="5" cy="11" r="1" fill="currentColor" opacity="0.6"/>
                </svg>
              </button>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setOpenModal('add')}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span className="hidden sm:inline">Invite</span>
            </Button>
          </div>
        </div>

        {/* Bottom row: Search + filter */}
        {pollinators.length > 0 && (
          <div className="flex items-center gap-2">
            <SearchBar />
            <button
              onClick={toggleFilters}
              className="px-3 py-2 text-xs font-body font-medium text-[var(--text-secondary)] hover:text-ember border border-[var(--border-default)] rounded-[var(--radius-tag)] hover:border-ember/30 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="inline mr-1.5">
                <path d="M1 3h12M3 7h8M5 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Filters
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
