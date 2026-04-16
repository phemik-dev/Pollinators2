'use client';

import { AppShell } from '@/components/layout/AppShell';
import { DirectoryView } from '@/components/directory/DirectoryView';

export default function Home() {
  return (
    <AppShell>
      <DirectoryView />
    </AppShell>
  );
}
