'use client';

import { useState, KeyboardEvent } from 'react';
import { TagBadge } from './TagBadge';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export function TagInput({ tags, onChange, placeholder = 'Add tags (press Enter or comma)' }: TagInputProps) {
  const [input, setInput] = useState('');

  const addTag = (raw: string) => {
    const tag = raw.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      onChange([...tags, tag]);
    }
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    }
    if (e.key === 'Backspace' && input === '' && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[var(--text-secondary)] font-body">
        Tags
      </label>
      <div className="
        flex flex-wrap items-center gap-1.5 p-2
        bg-[var(--bg-secondary)] border border-[var(--border-default)]
        rounded-[var(--radius-tag)]
        focus-within:border-ember focus-within:ring-1 focus-within:ring-ember/30
        transition-colors duration-150
      ">
        {tags.map((tag) => (
          <TagBadge key={tag} tag={tag} onRemove={() => onChange(tags.filter((t) => t !== tag))} />
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => input && addTag(input)}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="
            flex-1 min-w-[120px] bg-transparent text-sm font-body
            text-[var(--text-primary)] placeholder:text-[var(--text-soft)]
            outline-none border-none
          "
        />
      </div>
    </div>
  );
}
