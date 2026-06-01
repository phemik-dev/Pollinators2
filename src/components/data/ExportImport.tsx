'use client';

import { useRef } from 'react';
import { usePollinatorStore } from '@/store/usePollinatorStore';
import { exportToJSON, validateImport } from '@/lib/export';
import { parseContactFile } from '@/lib/importContacts';
import { generateId } from '@/lib/ids';
import { Button } from '@/components/shared/Button';
import type { Pollinator } from '@/types/pollinator';

export function ExportImport() {
  const pollinators = usePollinatorStore((s) => s.pollinators);
  const importPollinators = usePollinatorStore((s) => s.importPollinators);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    exportToJSON(pollinators);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isCSV = file.name.toLowerCase().endsWith('.csv');
    const reader = new FileReader();

    reader.onload = () => {
      const text = reader.result as string;

      if (isCSV) {
        const imported = parseContactFile(file.name, text);
        if (imported.length === 0) {
          alert('No contacts found in the CSV file.');
          return;
        }

        const now = new Date().toISOString();
        const converted: Pollinator[] = imported.map(({ _imported: _, ...contact }) => ({
          ...contact,
          id: generateId(),
          dateAdded: now,
          interactions: [],
          lastContact: undefined,
          reciprocityState: 'balanced' as const,
        }));

        const mode = pollinators.length > 0
          ? confirm(
              `Found ${converted.length} contacts in the CSV.\n\n` +
              `OK = Merge with existing\n` +
              `Cancel = Replace all existing data`
            )
            ? 'merge' as const
            : 'replace' as const
          : 'replace' as const;

        importPollinators(converted, mode);
        alert(`Imported ${converted.length} contacts. Ubuntu-specific fields (why they matter, trust, tier) still need your attention.`);
        return;
      }

      try {
        const data = JSON.parse(text);
        const result = validateImport(data);

        if (result.pollinators.length === 0) {
          alert('No valid pollinators found in the file.');
          return;
        }

        const mode = pollinators.length > 0
          ? confirm(
              `Found ${result.pollinators.length} connections.\n\n` +
              `OK = Merge with existing (add new, keep existing)\n` +
              `Cancel = Replace all existing data`
            )
            ? 'merge' as const
            : 'replace' as const
          : 'replace' as const;

        importPollinators(result.pollinators, mode);

        if (result.errors.length > 0) {
          alert(`Imported with ${result.errors.length} warnings:\n${result.errors.join('\n')}`);
        }
      } catch {
        alert('Could not read this file. Please use a valid JSON export.');
      }
    };

    reader.readAsText(file);

    // Reset file input
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={handleExport} disabled={pollinators.length === 0}>
        Export
      </Button>
      <label>
        <Button variant="ghost" size="sm" onClick={() => fileRef.current?.click()}>
          Import
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept=".json,.csv"
          onChange={handleImport}
          className="hidden"
        />
      </label>
    </div>
  );
}
