'use client';

import { useUIStore } from '@/store/useUIStore';
import { useEffect } from 'react';

export function ThemeToggle() {
  const theme = useUIStore((s) => s.theme);
  const toggleTheme = useUIStore((s) => s.toggleTheme);

  // Apply theme on mount (hydration sync)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-[var(--radius-tag)] text-[var(--text-secondary)] hover:text-ember hover:bg-[var(--border-light)] transition-all duration-150"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        /* Moon icon */
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            d="M15.5 10.5a6.5 6.5 0 01-8-8A6.5 6.5 0 1015.5 10.5z"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
      ) : (
        /* Sun icon */
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2M3.7 3.7l1.4 1.4M12.9 12.9l1.4 1.4M14.3 3.7l-1.4 1.4M5.1 12.9l-1.4 1.4"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
}
