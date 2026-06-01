import type { Tier, ReciprocityState, TrustLevel } from './pollinator';

export type ViewMode = 'list' | 'galaxy';

export type SortOption = 'name-asc' | 'last-contact' | 'trust-high' | 'date-added';

export type ModalType = 'add' | 'edit' | 'interaction' | 'delete' | null;

export interface FilterState {
  tiers: Tier[];
  reciprocity: ReciprocityState[];
  trustMin: TrustLevel;
  trustMax: TrustLevel;
  tags: string[];
  awaitingStory: boolean;
}

export const DEFAULT_FILTERS: FilterState = {
  tiers: [],
  reciprocity: [],
  trustMin: 1,
  trustMax: 5,
  tags: [],
  awaitingStory: false,
};
