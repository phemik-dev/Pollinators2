'use client';

import { Modal } from '@/components/shared/Modal';
import { PollinatorForm } from './PollinatorForm';
import { useUIStore } from '@/store/useUIStore';
import { usePollinatorStore } from '@/store/usePollinatorStore';
import type { NewPollinator } from '@/types/pollinator';

export function PollinatorModal() {
  const openModal = useUIStore((s) => s.openModal);
  const setOpenModal = useUIStore((s) => s.setOpenModal);
  const selectedId = useUIStore((s) => s.selectedPollinatorId);
  const addPollinator = usePollinatorStore((s) => s.addPollinator);
  const updatePollinator = usePollinatorStore((s) => s.updatePollinator);
  const pollinator = usePollinatorStore((s) =>
    s.pollinators.find((p) => p.id === selectedId)
  );

  const isAdd = openModal === 'add';
  const isEdit = openModal === 'edit';
  const isOpen = isAdd || isEdit;

  const handleSubmit = (data: NewPollinator) => {
    if (isAdd) {
      addPollinator(data);
    } else if (isEdit && selectedId) {
      updatePollinator(selectedId, data);
    }
    setOpenModal(null);
  };

  return (
    <Modal
      open={isOpen}
      onClose={() => setOpenModal(null)}
      title={isAdd ? 'Invite someone into your constellation' : 'Update this connection'}
    >
      <PollinatorForm
        initial={isEdit ? pollinator : undefined}
        onSubmit={handleSubmit}
        onCancel={() => setOpenModal(null)}
      />
    </Modal>
  );
}
