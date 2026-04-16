'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Pollinator, NewPollinator, NewInteraction } from '@/types/pollinator';
import { generateId } from '@/lib/ids';
import { toISODate } from '@/lib/dates';
import { deriveReciprocity } from '@/lib/reciprocity';

interface PollinatorStore {
  pollinators: Pollinator[];

  addPollinator: (data: NewPollinator) => void;
  updatePollinator: (id: string, data: Partial<Pollinator>) => void;
  deletePollinator: (id: string) => void;
  addInteraction: (pollinatorId: string, interaction: NewInteraction) => void;
  importPollinators: (data: Pollinator[], mode: 'merge' | 'replace') => void;
}

export const usePollinatorStore = create<PollinatorStore>()(
  persist(
    (set) => ({
      pollinators: [],

      addPollinator: (data) =>
        set((state) => ({
          pollinators: [
            ...state.pollinators,
            {
              ...data,
              id: generateId(),
              dateAdded: new Date().toISOString(),
              interactions: [],
              lastContact: undefined,
              reciprocityState: 'balanced',
            },
          ],
        })),

      updatePollinator: (id, data) =>
        set((state) => ({
          pollinators: state.pollinators.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
        })),

      deletePollinator: (id) =>
        set((state) => ({
          pollinators: state.pollinators.filter((p) => p.id !== id),
        })),

      addInteraction: (pollinatorId, interaction) =>
        set((state) => ({
          pollinators: state.pollinators.map((p) => {
            if (p.id !== pollinatorId) return p;

            const newInteraction = { ...interaction, id: generateId() };
            const interactions = [...p.interactions, newInteraction];

            return {
              ...p,
              interactions,
              lastContact: interaction.date || toISODate(),
              reciprocityState: deriveReciprocity(interactions),
            };
          }),
        })),

      importPollinators: (data, mode) =>
        set((state) => {
          if (mode === 'replace') {
            return { pollinators: data };
          }
          // Merge: add new, skip existing (by id)
          const existingIds = new Set(state.pollinators.map((p) => p.id));
          const newOnes = data.filter((p) => !existingIds.has(p.id));
          return { pollinators: [...state.pollinators, ...newOnes] };
        }),
    }),
    {
      name: 'pollinators-v1',
    }
  )
);
