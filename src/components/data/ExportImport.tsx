'use client';

import { useRef } from 'react';
import { usePollinatorStore } from '@/store/usePollinatorStore';
import { exportToJSON, validateImport } from '@/lib/export';
import { Button } from '@/components/shared/Button';

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

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
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
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />
      </label>
    </div>
  );
}
