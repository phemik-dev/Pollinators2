'use client';

import { useMemo } from 'react';
import type { Pollinator } from '@/types/pollinator';
import { useUIStore } from '@/store/useUIStore';

interface GalaxyViewProps {
  pollinators: Pollinator[];
}

const ORBIT_RADII = {
  active: 0.28,
  warm: 0.48,
  dormant: 0.68,
};

const reciprocityColors: Record<string, string> = {
  'your-turn': '#F0C040',
  'their-turn': '#6BBF8E',
  balanced: '#F5EDD9',
};

export function GalaxyView({ pollinators }: GalaxyViewProps) {
  const selectPollinator = useUIStore((s) => s.selectPollinator);

  const viewBox = 600;
  const center = viewBox / 2;

  const nodes = useMemo(() => {
    const tiers = { active: [] as Pollinator[], warm: [] as Pollinator[], dormant: [] as Pollinator[] };
    pollinators.forEach((p) => tiers[p.tier].push(p));

    const result: { p: Pollinator; x: number; y: number; r: number; color: string }[] = [];

    for (const tier of ['active', 'warm', 'dormant'] as const) {
      const group = tiers[tier];
      const orbitR = ORBIT_RADII[tier] * viewBox;

      group.forEach((p, i) => {
        // Distribute evenly with slight organic offset
        const baseAngle = (i / Math.max(group.length, 1)) * Math.PI * 2;
        const seed = p.id.charCodeAt(0) + p.id.charCodeAt(p.id.length - 1);
        const jitter = ((seed % 20) - 10) * 0.03;
        const angle = baseAngle + jitter;
        const radiusJitter = 1 + ((seed % 10) - 5) * 0.015;

        const x = center + Math.cos(angle) * orbitR * radiusJitter;
        const y = center + Math.sin(angle) * orbitR * radiusJitter;
        const nodeR = 6 + p.trustLevel * 3;

        result.push({
          p,
          x,
          y,
          r: nodeR,
          color: reciprocityColors[p.reciprocityState] || '#F5EDD9',
        });
      });
    }

    return result;
  }, [pollinators, center, viewBox]);

  return (
    <div className="w-full rounded-[var(--radius-card)] overflow-hidden bg-midnight p-4">
      <svg
        viewBox={`0 0 ${viewBox} ${viewBox}`}
        className="w-full max-w-2xl mx-auto"
        role="img"
        aria-label="Galaxy view of your constellation"
      >
        <defs>
          {/* Glow filter for center */}
          <filter id="glow-center">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Glow for your-turn nodes */}
          <filter id="glow-solar">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Orbit rings */}
        {Object.values(ORBIT_RADII).map((ratio, i) => (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={ratio * viewBox}
            fill="none"
            stroke="rgba(245,237,217,0.08)"
            strokeWidth="1"
            strokeDasharray="4 6"
          />
        ))}

        {/* Connection lines from center to active nodes */}
        {nodes
          .filter((n) => n.p.tier === 'active')
          .map((n) => (
            <line
              key={`line-${n.p.id}`}
              x1={center}
              y1={center}
              x2={n.x}
              y2={n.y}
              stroke="rgba(232,114,42,0.12)"
              strokeWidth="0.5"
            />
          ))}

        {/* Center node — "You" */}
        <circle
          cx={center}
          cy={center}
          r={16}
          fill="#E8722A"
          filter="url(#glow-center)"
          opacity="0.9"
        />
        <text
          x={center}
          y={center + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#FFFFFF"
          fontSize="8"
          fontFamily="'Space Mono', monospace"
          fontWeight="700"
        >
          YOU
        </text>

        {/* Pollinator nodes */}
        {nodes.map((node) => (
          <g
            key={node.p.id}
            className="cursor-pointer"
            onClick={() => selectPollinator(node.p.id)}
            role="button"
            aria-label={`${node.p.name} — ${node.p.currentPursuit}`}
          >
            <title>{`${node.p.name}\n${node.p.currentPursuit}`}</title>
            <circle
              cx={node.x}
              cy={node.y}
              r={node.r}
              fill={node.color}
              opacity={node.p.tier === 'dormant' ? 0.5 : 0.8}
              filter={node.p.reciprocityState === 'your-turn' ? 'url(#glow-solar)' : undefined}
              className="transition-all duration-200 hover:opacity-100"
            />
            <circle
              cx={node.x}
              cy={node.y}
              r={node.r + 3}
              fill="transparent"
              stroke="transparent"
              className="hover:stroke-ember/40"
              strokeWidth="2"
            />
            {/* Name label for larger nodes (trust 4+) */}
            {node.p.trustLevel >= 4 && (
              <text
                x={node.x}
                y={node.y + node.r + 12}
                textAnchor="middle"
                fill="rgba(245,237,217,0.5)"
                fontSize="7"
                fontFamily="'Plus Jakarta Sans', sans-serif"
              >
                {node.p.name.split(' ')[0]}
              </text>
            )}
          </g>
        ))}

        {/* Orbit labels */}
        <text x={center + ORBIT_RADII.active * viewBox + 8} y={center - 6} fill="rgba(107,191,142,0.4)" fontSize="7" fontFamily="'Space Mono', monospace">
          ACTIVE
        </text>
        <text x={center + ORBIT_RADII.warm * viewBox + 8} y={center - 6} fill="rgba(240,192,64,0.3)" fontSize="7" fontFamily="'Space Mono', monospace">
          WARM
        </text>
        <text x={center + ORBIT_RADII.dormant * viewBox + 8} y={center - 6} fill="rgba(245,237,217,0.2)" fontSize="7" fontFamily="'Space Mono', monospace">
          RESTING
        </text>
      </svg>
    </div>
  );
}
