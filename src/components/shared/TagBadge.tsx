'use client';

interface TagBadgeProps {
  tag: string;
  onRemove?: () => void;
}

export function TagBadge({ tag, onRemove }: TagBadgeProps) {
  return (
    <span className="
      inline-flex items-center gap-1
      px-2.5 py-0.5
      font-mono text-[9px] uppercase tracking-[0.18em]
      bg-[var(--border-light)] text-[var(--text-secondary)]
      rounded-[var(--radius-pill)]
      border border-[var(--border-default)]
    ">
      {tag}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 hover:text-ember transition-colors"
          aria-label={`Remove ${tag}`}
        >
          &times;
        </button>
      )}
    </span>
  );
}
