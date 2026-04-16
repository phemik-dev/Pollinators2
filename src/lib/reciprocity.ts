import type { Interaction, ReciprocityState } from '@/types/pollinator';

/**
 * Derive the pollinator's reciprocity state from their most recent interaction.
 * Simple mapping — no scoring algorithm.
 */
export function deriveReciprocity(interactions: Interaction[]): ReciprocityState {
  if (interactions.length === 0) return 'balanced';

  const sorted = [...interactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const latest = sorted[0];

  switch (latest.reciprocity) {
    case 'i-owe-them':
      return 'your-turn';
    case 'they-owe-me':
      return 'their-turn';
    case 'balanced':
      return 'balanced';
  }
}
