export type TrustLevel = 1 | 2 | 3 | 4 | 5;

export type Tier = 'active' | 'warm' | 'dormant';

export type ReciprocityState = 'your-turn' | 'their-turn' | 'balanced';

export type InteractionType = 'call' | 'email' | 'meeting' | 'conference';

export type InteractionReciprocity = 'i-owe-them' | 'they-owe-me' | 'balanced';

export interface ContactInfo {
  email?: string;
  phone?: string;
  linkedin?: string;
}

export interface Interaction {
  id: string;
  type: InteractionType;
  date: string; // ISO date
  summary: string;
  reciprocity: InteractionReciprocity;
}

export interface Pollinator {
  id: string;
  name: string;
  organization?: string;
  role?: string;
  currentPursuit: string;
  whyTheyMatter: string;
  tags: string[];
  trustLevel: TrustLevel;
  trustNote: string;
  tier: Tier;
  contactInfo: ContactInfo;
  interactions: Interaction[];
  dateAdded: string; // ISO date
  lastContact?: string; // ISO date of most recent interaction
  reciprocityState: ReciprocityState;
}

/** Shape for creating a new pollinator (id, dateAdded auto-generated) */
export type NewPollinator = Omit<Pollinator, 'id' | 'dateAdded' | 'interactions' | 'lastContact' | 'reciprocityState'>;

/** Shape for creating a new interaction (id auto-generated) */
export type NewInteraction = Omit<Interaction, 'id'>;
