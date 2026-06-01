'use client';

import { useUIStore } from '@/store/useUIStore';
import { usePollinatorStore } from '@/store/usePollinatorStore';
import { useFilteredPollinators } from '@/hooks/useFilteredPollinators';
import { TieredList } from './TieredList';
import { EmptyState } from './EmptyState';
import { PersonDetail } from './PersonDetail';
import { FilterPanel } from '@/components/shared/FilterPanel';
import { GalaxyView } from '@/components/galaxy/GalaxyView';
import { PollinatorModal } from '@/components/forms/PollinatorModal';
import { InteractionModal } from '@/components/forms/InteractionModal';
import { DeleteConfirm } from '@/components/forms/DeleteConfirm';
import { BackupReminder } from '@/components/data/BackupReminder';
import { NudgeReminder } from '@/components/data/NudgeReminder';
import { QuarterlyAudit } from '@/components/data/QuarterlyAudit';

export function DirectoryView() {
  const viewMode = useUIStore((s) => s.viewMode);
  const allPollinators = usePollinatorStore((s) => s.pollinators);
  const filtered = useFilteredPollinators();

  const isEmpty = allPollinators.length === 0;

  return (
    <>
      {isEmpty ? (
        <EmptyState />
      ) : (
        <>
          <FilterPanel />

          {filtered.length === 0 ? (
            <EmptyState isFiltered />
          ) : viewMode === 'list' ? (
            <TieredList pollinators={filtered} />
          ) : (
            <GalaxyView pollinators={filtered} />
          )}
        </>
      )}

      {/* Overlays */}
      <PersonDetail />
      <PollinatorModal />
      <InteractionModal />
      <DeleteConfirm />
      {/* Reminder cards — NudgeReminder sits above BackupReminder on the right */}
      <NudgeReminder />
      <BackupReminder />
      {/* QuarterlyAudit appears on the left, suppressed when nudges are showing */}
      <QuarterlyAudit />
    </>
  );
}
