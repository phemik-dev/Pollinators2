'use client';

import { useState } from 'react';
import type { NewInteraction, InteractionType, InteractionReciprocity } from '@/types/pollinator';
import { Input } from '@/components/shared/Input';
import { TextArea } from '@/components/shared/TextArea';
import { Select } from '@/components/shared/Select';
import { Button } from '@/components/shared/Button';
import { toISODate } from '@/lib/dates';

interface InteractionFormProps {
  onSubmit: (data: NewInteraction) => void;
  onCancel: () => void;
}

export function InteractionForm({ onSubmit, onCancel }: InteractionFormProps) {
  const [type, setType] = useState<InteractionType>('call');
  const [date, setDate] = useState(toISODate());
  const [summary, setSummary] = useState('');
  const [reciprocity, setReciprocity] = useState<InteractionReciprocity>('balanced');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!summary.trim()) errs.summary = 'A brief note helps you remember';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    onSubmit({
      type,
      date,
      summary: summary.trim(),
      reciprocity,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label="Type of exchange"
        value={type}
        onChange={(e) => setType(e.target.value as InteractionType)}
        options={[
          { value: 'call', label: 'Call' },
          { value: 'email', label: 'Email' },
          { value: 'meeting', label: 'Meeting' },
          { value: 'conference', label: 'Conference' },
        ]}
      />

      <Input
        label="When"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <TextArea
        label="What happened"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        error={errors.summary}
        placeholder="One line — what did you discuss or share?"
        rows={2}
      />

      <Select
        label="Flow of reciprocity"
        value={reciprocity}
        onChange={(e) => setReciprocity(e.target.value as InteractionReciprocity)}
        options={[
          { value: 'balanced', label: 'We are balanced' },
          { value: 'i-owe-them', label: "I'll reach out next" },
          { value: 'they-owe-me', label: "They'll follow up" },
        ]}
      />

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Record Exchange
        </Button>
      </div>
    </form>
  );
}
