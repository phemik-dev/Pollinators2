'use client';

import { Modal } from '@/components/shared/Modal';
import { Button } from '@/components/shared/Button';
import { useUIStore } from '@/store/useUIStore';
import { usePollinatorStore } from '@/store/usePollinatorStore';

export function DeleteConfirm() {
  const openModal = useUIStore((s) => s.openModal);
  const setOpenModal = useUIStore((s) => s.setOpenModal);
  const selectedId = useUIStore((s) => s.selectedPollinatorId);
  const selectPollinator = useUIStore((s) => s.selectPollinator);
  const deletePollinator = usePollinatorStore((s) => s.deletePollinator);
  const pollinator = usePollinatorStore((s) =>
    s.pollinators.find((p) => p.id === selectedId)
  );

  const isOpen = openModal === 'delete';

  const handleDelete = () => {
    if (selectedId) {
      deletePollinator(selectedId);
      selectPollinator(null);
    }
    setOpenModal(null);
  };

  if (!pollinator) return null;

  return (
    <Modal
      open={isOpen}
      onClose={() => setOpenModal(null)}
      title="Release this connection"
    >
      <div className="space-y-4">
        <p className="text-sm font-body text-[var(--text-secondary)] leading-relaxed">
          Release <strong className="text-[var(--text-primary)]">{pollinator.name}</strong> from
          the directory? Their story will be removed, though the impact remains.
        </p>

        <p className="text-xs font-display italic text-[var(--text-soft)]">
          &ldquo;Umntu akalahlwa&rdquo; &mdash; A person is never thrown away.
          This only removes them from your directory.
        </p>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={() => setOpenModal(null)}>
            Keep in Constellation
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Release
          </Button>
        </div>
      </div>
    </Modal>
  );
}
