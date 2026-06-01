import type { Pollinator } from '@/types/pollinator';

const REQUIRED_FIELDS = ['id', 'name', 'currentPursuit', 'tier'] as const;

export function exportToJSON(pollinators: Pollinator[]): void {
  const data = {
    version: 1, // reserved for future migration logic
    exportDate: new Date().toISOString(),
    pollinators,
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const date = new Date().toISOString().split('T')[0];

  const a = document.createElement('a');
  a.href = url;
  a.download = `pollinators-constellation-${date}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function validateImport(data: unknown): { valid: boolean; pollinators: Pollinator[]; errors: string[] } {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    return { valid: false, pollinators: [], errors: ['Invalid file format'] };
  }

  const obj = data as Record<string, unknown>;
  let pollinators: unknown[];

  if (Array.isArray(obj)) {
    pollinators = obj;
  } else if (Array.isArray(obj.pollinators)) {
    pollinators = obj.pollinators;
  } else {
    return { valid: false, pollinators: [], errors: ['No pollinators array found'] };
  }

  const validated: Pollinator[] = [];

  for (let i = 0; i < pollinators.length; i++) {
    const p = pollinators[i] as Record<string, unknown>;
    if (!p || typeof p !== 'object') {
      errors.push(`Entry ${i + 1}: not an object`);
      continue;
    }

    const missing = REQUIRED_FIELDS.filter(f => !p[f]);
    if (missing.length > 0) {
      errors.push(`Entry ${i + 1} (${p.name || 'unnamed'}): missing ${missing.join(', ')}`);
      continue;
    }

    validated.push({
      id: String(p.id),
      name: String(p.name),
      organization: p.organization ? String(p.organization) : undefined,
      role: p.role ? String(p.role) : undefined,
      currentPursuit: String(p.currentPursuit),
      whyTheyMatter: p.whyTheyMatter ? String(p.whyTheyMatter) : '',
      tags: Array.isArray(p.tags) ? p.tags.map(String) : [],
      trustLevel: ([1, 2, 3, 4, 5].includes(Number(p.trustLevel)) ? Number(p.trustLevel) : 3) as 1 | 2 | 3 | 4 | 5,
      trustNote: p.trustNote ? String(p.trustNote) : '',
      tier: ['active', 'warm', 'dormant'].includes(String(p.tier)) ? String(p.tier) as Pollinator['tier'] : 'warm',
      contactInfo: (p.contactInfo as Pollinator['contactInfo']) || {},
      interactions: Array.isArray(p.interactions) ? p.interactions as Pollinator['interactions'] : [],
      dateAdded: p.dateAdded ? String(p.dateAdded) : new Date().toISOString(),
      lastContact: p.lastContact ? String(p.lastContact) : undefined,
      reciprocityState: ['your-turn', 'their-turn', 'balanced'].includes(String(p.reciprocityState))
        ? String(p.reciprocityState) as Pollinator['reciprocityState']
        : 'balanced',
    });
  }

  return { valid: errors.length === 0, pollinators: validated, errors };
}
