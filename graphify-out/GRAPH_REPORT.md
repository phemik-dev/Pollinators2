# Graph Report - .  (2026-06-15)

## Corpus Check
- Corpus is ~19,091 words - fits in a single context window. You may not need a graph.

## Summary
- 238 nodes · 528 edges · 16 communities (10 shown, 6 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 17 edges (avg confidence: 0.83)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_App Pages and Reminders|App Pages and Reminders]]
- [[_COMMUNITY_Interaction and Pollinator Forms|Interaction and Pollinator Forms]]
- [[_COMMUNITY_Export Header and Theme|Export Header and Theme]]
- [[_COMMUNITY_Ubuntu Design Philosophy|Ubuntu Design Philosophy]]
- [[_COMMUNITY_Directory Card Components|Directory Card Components]]
- [[_COMMUNITY_Project Dependencies|Project Dependencies]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_UI State and Filters|UI State and Filters]]
- [[_COMMUNITY_App Layout and Fonts|App Layout and Fonts]]
- [[_COMMUNITY_App Shell Layout|App Shell Layout]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_Next.js Config|Next.js Config]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_File Icon Asset|File Icon Asset]]
- [[_COMMUNITY_Globe Icon Asset|Globe Icon Asset]]
- [[_COMMUNITY_Window Icon Asset|Window Icon Asset]]

## God Nodes (most connected - your core abstractions)
1. `useUIStore` - 31 edges
2. `usePollinatorStore` - 27 edges
3. `Pollinator` - 18 edges
4. `compilerOptions` - 16 edges
5. `Building Pollinators — Living Manuscript` - 14 edges
6. `Button()` - 9 edges
7. `Pollinators Touchstone — The Sacred Scroll` - 9 edges
8. `Ubuntu Philosophy — I Am Because We Are` - 8 edges
9. `TrustLevel` - 7 edges
10. `Tier` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Next.js Wordmark SVG` --conceptually_related_to--> `AGENTS.md — Next.js Agent Rules`  [INFERRED]
  public/next.svg → AGENTS.md
- `Vercel Logo SVG (Triangle)` --conceptually_related_to--> `README — Pollinators Overview`  [INFERRED]
  public/vercel.svg → README.md
- `Stokvel — South African Rotating Credit Association` --semantically_similar_to--> `Reciprocity Flow — Neutral Warm Indicators Not Debt Tracking`  [INFERRED] [semantically similar]
  docs/building-pollinators-manuscript.md → CLAUDE.md
- `REMEMBER Territory Map` --references--> `REMEMBER Territory — The Living Directory`  [INFERRED]
  docs/remember-territory-map.pdf → docs/building-pollinators-manuscript.md
- `Galaxy Constellation View — SVG Network Visualization` --conceptually_related_to--> `REMEMBER Territory — The Living Directory`  [INFERRED]
  CLAUDE.md → docs/building-pollinators-manuscript.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Three Territories — Remember, Reveal, Renew as Core Architecture** — concept_remember_territory, concept_reveal_territory, concept_renew_territory [EXTRACTED 1.00]
- **Ubuntu Design Principles Cluster — Philosophy Grounding All Decisions** — concept_ubuntu_philosophy, concept_ubuntu_alignment_rules, concept_indaba_method, concept_care_framework, concept_three_knowledge_tiers [EXTRACTED 0.95]
- **MVP Scope Boundary — REMEMBER Only, Not REVEAL or RENEW** — concept_remember_territory, concept_feature_creep_pruning, concept_pollinators_touchstone [EXTRACTED 0.95]

## Communities (16 total, 6 thin omitted)

### Community 0 - "App Pages and Reminders"
Cohesion: 0.12
Nodes (24): BackupReminder(), NudgeReminder(), QuarterlyAudit(), DirectoryView(), EmptyState(), EmptyStateProps, interactionIcons, PersonDetail() (+16 more)

### Community 1 - "Interaction and Pollinator Forms"
Cohesion: 0.12
Nodes (23): InteractionForm(), InteractionFormProps, PollinatorForm(), PollinatorFormProps, toISODate(), deriveReciprocity(), Input, InputProps (+15 more)

### Community 2 - "Export Header and Theme"
Cohesion: 0.11
Nodes (23): ExportImport(), ThemeToggle(), exportToJSON(), REQUIRED_FIELDS, validateImport(), generateId(), CSVFormat, decodeVCardValue() (+15 more)

### Community 3 - "Ubuntu Design Philosophy"
Cohesion: 0.13
Nodes (29): AGENTS.md — Next.js Agent Rules, The Baobab Complex — Resource-Rich Benefit-Poor Pattern, CARE Framework — Courage Agency Reaction Empathy, AI BizHive Design System — Tokens and Color Families, Digital Indaba — Gathering Place for Sleeping Social Capital, Feature Creep Risk and Pruning Philosophy, Galaxy Constellation View — SVG Network Visualization, Indaba Method — Five-Phase Ubuntu Design Process (+21 more)

### Community 4 - "Directory Card Components"
Cohesion: 0.11
Nodes (19): PersonCard(), PersonCardProps, TieredList(), TieredListProps, tierConfig, TierSection(), TierSectionProps, GalaxyViewProps (+11 more)

### Community 5 - "Project Dependencies"
Cohesion: 0.09
Nodes (22): dependencies, next, react, react-dom, zustand, devDependencies, eslint, eslint-config-next (+14 more)

### Community 6 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 7 - "UI State and Filters"
Cohesion: 0.40
Nodes (9): UIStore, DEFAULT_FILTERS, FilterState, ModalType, SortOption, ViewMode, ReciprocityState, Tier (+1 more)

### Community 8 - "App Layout and Fonts"
Cohesion: 0.33
Nodes (4): cormorant, jakarta, metadata, spaceMono

### Community 9 - "App Shell Layout"
Cohesion: 0.50
Nodes (3): AppShell(), AppShellProps, ServiceBar()

## Knowledge Gaps
- **75 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+70 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useUIStore` connect `App Pages and Reminders` to `Interaction and Pollinator Forms`, `Export Header and Theme`, `Directory Card Components`, `UI State and Filters`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Why does `usePollinatorStore` connect `App Pages and Reminders` to `Interaction and Pollinator Forms`, `Export Header and Theme`, `UI State and Filters`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Why does `Pollinator` connect `Directory Card Components` to `App Pages and Reminders`, `Interaction and Pollinator Forms`, `Export Header and Theme`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _75 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App Pages and Reminders` be split into smaller, more focused modules?**
  _Cohesion score 0.12179487179487179 - nodes in this community are weakly interconnected._
- **Should `Interaction and Pollinator Forms` be split into smaller, more focused modules?**
  _Cohesion score 0.11746031746031746 - nodes in this community are weakly interconnected._
- **Should `Export Header and Theme` be split into smaller, more focused modules?**
  _Cohesion score 0.10967741935483871 - nodes in this community are weakly interconnected._