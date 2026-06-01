import type { Pollinator } from '@/types/pollinator';

/**
 * Returns true when a pollinator has no currentPursuit text — their story is
 * still waiting to be added.
 */
export function isAwaitingStory(p: Pollinator): boolean {
  return !p.currentPursuit?.trim();
}
