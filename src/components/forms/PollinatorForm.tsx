'use client';

import { useState } from 'react';
import type { Pollinator, NewPollinator, Tier, TrustLevel } from '@/types/pollinator';
import { Input } from '@/components/shared/Input';
import { TextArea } from '@/components/shared/TextArea';
import { Select } from '@/components/shared/Select';
import { Button } from '@/components/shared/Button';
import { TrustStars } from '@/components/shared/TrustStars';
import { TagInput } from '@/components/shared/TagInput';

interface PollinatorFormProps {
  initial?: Pollinator;
  onSubmit: (data: NewPollinator) => void;
  onCancel: () => void;
}

export function PollinatorForm({ initial, onSubmit, onCancel }: PollinatorFormProps) {
  const [name, setName] = useState(initial?.name || '');
  const [organization, setOrganization] = useState(initial?.organization || '');
  const [role, setRole] = useState(initial?.role || '');
  const [currentPursuit, setCurrentPursuit] = useState(initial?.currentPursuit || '');
  const [whyTheyMatter, setWhyTheyMatter] = useState(initial?.whyTheyMatter || '');
  const [tags, setTags] = useState<string[]>(initial?.tags || []);
  const [trustLevel, setTrustLevel] = useState<TrustLevel>(initial?.trustLevel || 3);
  const [trustNote, setTrustNote] = useState(initial?.trustNote || '');
  const [tier, setTier] = useState<Tier>(initial?.tier || 'warm');
  const [email, setEmail] = useState(initial?.contactInfo?.email || '');
  const [phone, setPhone] = useState(initial?.contactInfo?.phone || '');
  const [linkedin, setLinkedin] = useState(initial?.contactInfo?.linkedin || '');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Their name is needed';
    if (!currentPursuit.trim()) e.currentPursuit = 'What are they working on?';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      name: name.trim(),
      organization: organization.trim() || undefined,
      role: role.trim() || undefined,
      currentPursuit: currentPursuit.trim(),
      whyTheyMatter: whyTheyMatter.trim(),
      tags,
      trustLevel,
      trustNote: trustNote.trim(),
      tier,
      contactInfo: {
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        linkedin: linkedin.trim() || undefined,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Identity */}
      <div className="space-y-3">
        <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-ember">
          Who Are They
        </p>
        <Input
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          placeholder="Their full name"
          required
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Organisation"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            placeholder="Where they work"
          />
          <Input
            label="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="What they do"
          />
        </div>
      </div>

      {/* Their work */}
      <div className="space-y-3">
        <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-ember">
          What They Carry
        </p>
        <TextArea
          label="Current pursuit"
          value={currentPursuit}
          onChange={(e) => setCurrentPursuit(e.target.value)}
          error={errors.currentPursuit}
          placeholder="What are they working on right now?"
          rows={2}
          required
        />
        <TextArea
          label="Why they matter to our work"
          value={whyTheyMatter}
          onChange={(e) => setWhyTheyMatter(e.target.value)}
          placeholder="One line about how your paths align"
          rows={2}
        />
      </div>

      {/* Trust */}
      <div className="space-y-3">
        <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-ember">
          Trust
        </p>
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] font-body block mb-1.5">
            How deeply do you trust this connection?
          </label>
          <TrustStars level={trustLevel} onChange={setTrustLevel} />
        </div>
        <Input
          label="Trust note"
          value={trustNote}
          onChange={(e) => setTrustNote(e.target.value)}
          placeholder="Why you trust them (in your own words)"
        />
      </div>

      {/* Circle */}
      <div className="space-y-3">
        <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-ember">
          Which Circle
        </p>
        <Select
          label="Tier"
          value={tier}
          onChange={(e) => setTier(e.target.value as Tier)}
          options={[
            { value: 'active', label: 'Active constellation — weekly rhythm' },
            { value: 'warm', label: 'Warm connection — monthly rhythm' },
            { value: 'dormant', label: 'Resting bond — when the time is right' },
          ]}
        />
      </div>

      {/* Tags */}
      <TagInput tags={tags} onChange={setTags} />

      {/* Contact */}
      <div className="space-y-3">
        <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-ember">
          How to Reach Them
        </p>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="their@email.com"
        />
        <Input
          label="Phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+27..."
        />
        <Input
          label="LinkedIn"
          type="url"
          value={linkedin}
          onChange={(e) => setLinkedin(e.target.value)}
          placeholder="https://linkedin.com/in/..."
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {initial ? 'Update Connection' : 'Invite to Constellation'}
        </Button>
      </div>
    </form>
  );
}
