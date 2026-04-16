'use client';

import { ReactNode } from 'react';
import { ServiceBar } from './ServiceBar';
import { Header } from './Header';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <ServiceBar />
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6">
        {children}
      </main>

      <footer className="border-t border-[var(--border-default)] py-4 text-center">
        <p className="text-[9px] font-mono uppercase tracking-[0.18em] text-[var(--text-soft)]">
          Pollinators &mdash; part of the{' '}
          <span className="font-mono">
            <span className="text-ember">AI</span>
            <span className="text-[var(--text-primary)]">Biz</span>
            <span className="italic text-solar">Hive</span>
          </span>
          {' '}family
        </p>
      </footer>
    </div>
  );
}
