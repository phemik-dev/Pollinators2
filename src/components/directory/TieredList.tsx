'use client';

import type { Pollinator } from '@/types/pollinator';
import { TierSection } from './TierSection';

interface TieredListProps {
  pollinators: Pollinator[];
}

export function TieredList({ pollinators }: TieredListProps) {
  const active = pollinators.filter((p) => p.tier === 'active');
  const warm = pollinators.filter((p) => p.tier === 'warm');
  const dormant = pollinators.filter((p) => p.tier === 'dormant');

  return (
    <div>
      <TierSection tier="active" pollinators={active} defaultOpen={true} />
      <TierSection tier="warm" pollinators={warm} defaultOpen={active.length === 0} />
      <TierSection tier="dormant" pollinators={dormant} defaultOpen={false} />
    </div>
  );
}
