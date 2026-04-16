'use client';

import { Modal } from '@/components/shared/Modal';
import { InteractionForm } from './InteractionForm';
import { useUIStore } from '@/store/useUIStore';
import { usePollinatorStore } from '@/store/usePollinatorStore';
import type { NewInteraction } from '@/types/pollinator';

export function InteractionModal() {
  const openModal = useUIStore((s) => s.openModal);
  const setOpenModal = useUIStore((s) => s.setOpenModal);
  const selectedId = useUIStore((s) => s.selectedPollinatorId);
  const addInteraction = usePollinatorStore((s) => s.addInteraction);
  const pollinator = usePollinatorStore((s) =>
    s.pollinators.find((p) => p.id === selectedId)
  );

  const isOpen = openModal === 'interaction';

  const handleSubmit = (data: NewInteraction) => {
    if (selectedId) {
      addInteraction(selectedId, data);
    }
    setOpenModal(null);
  };

  if (!pollinator) return null;

  return (
    <Modal
      open={isOpen}
      onClose={() => setOpenModal(null)}
      title={`Record a moment of exchange with ${pollinator.name}`}
    >
      <InteractionForm
        onSubmit={handleSubmit}
        onCancel={() => setOpenModal(null)}
      />
    </Modal>
  );
}
