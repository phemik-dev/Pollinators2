@AGENTS.md

# Pollinators MVP — Project Conventions

## What This Is
A social capital activation tool grounded in Ubuntu philosophy. NOT a CRM.
This is the REMEMBER Territory only (Living Directory). Do NOT build REVEAL (AI/Hivemind) or RENEW (automated) features.

## Tech Stack
- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 (CSS-based @theme config, NOT tailwind.config.ts)
- Zustand v5 for state management (persist middleware → localStorage)
- No backend — localStorage only for MVP

## Design System
Uses AI BizHive design tokens. All colors, fonts, and radii defined in `src/app/globals.css` @theme block.

**Color families:** Midnight (dark), Ember (action/CTA), Solar (Ubuntu/warmth), Grove (compliance/health), Cream (page bg)
**Fonts:** Cormorant Garamond (display), Plus Jakarta Sans (body), Space Mono (tags/eyebrows)
**Radii:** 4px buttons, 8px tags, 14px features, 20px cards

## Ubuntu Alignment Rules (Non-negotiable)
- Collective language: "our constellation" not "your contacts"
- Elder-voice tone: invitations, not commands
- Reciprocity is neutral: "your turn" not "you owe"
- Trust is humanized: stars + text note, not just number
- No gamification: no points, badges, streaks
- No urgency: no red alerts, OVERDUE stamps
- No red in reciprocity: Solar gold = your turn, Grove green = their turn
- Simplicity as respect: if a feature doesn't serve daily use, cut it

## File Structure
- `src/types/` — TypeScript interfaces (Pollinator, Interaction, Filters)
- `src/store/` — Zustand stores (usePollinatorStore, useUIStore)
- `src/lib/` — Utility functions (ids, dates, reciprocity, export)
- `src/hooks/` — Custom React hooks (useFilteredPollinators, useBackupReminder)
- `src/components/layout/` — AppShell, Header, ServiceBar, ThemeToggle
- `src/components/directory/` — PersonCard, TieredList, TierSection, EmptyState, PersonDetail, DirectoryView
- `src/components/galaxy/` — GalaxyView (SVG constellation)
- `src/components/forms/` — PollinatorModal/Form, InteractionModal/Form, DeleteConfirm
- `src/components/shared/` — Reusable UI (Button, Input, Modal, TrustStars, ReciprocityDot, TagBadge, etc.)
- `src/components/data/` — ExportImport, BackupReminder

## Naming Conventions
- Components: PascalCase files, named exports
- Hooks: camelCase with `use` prefix
- Types: PascalCase interfaces, camelCase for type aliases
- CSS: Tailwind utilities + CSS custom properties via var()

## Key Data
- localStorage key: `pollinators-v1` (data), `pollinators-ui-v1` (UI preferences)
- Reciprocity derived from most recent interaction — no scoring algorithm

## Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run lint` — ESLint
