/**
 * Contact import parsers for vCard (.vcf) and CSV formats.
 * Supports: iPhone/Android exports, Gmail CSV, Outlook CSV.
 *
 * Imported contacts are seeded with sensible defaults — the Ubuntu-specific
 * fields (currentPursuit, whyTheyMatter, trustNote, tags) must be filled in
 * by the Integrator. That human judgment cannot be imported.
 */

import type { NewPollinator } from '@/types/pollinator';

export type ImportedContact = NewPollinator & { _imported: true };

// ─── vCard (.vcf) parser ────────────────────────────────────────────────────

/**
 * Parse a vCard file — handles single or multi-card .vcf files (v2.1, v3.0, v4.0).
 */
export function parseVCard(text: string): ImportedContact[] {
  const contacts: ImportedContact[] = [];

  // Split file into individual VCARD blocks
  const blocks = text.split(/BEGIN:VCARD/i).slice(1);

  for (const block of blocks) {
    const lines = unfoldVCardLines(block);
    const fields = new Map<string, string[]>();

    for (const line of lines) {
      if (!line || /^END:VCARD/i.test(line)) continue;
      const colonIdx = line.indexOf(':');
      if (colonIdx === -1) continue;

      const rawKey = line.substring(0, colonIdx).toUpperCase();
      const value = line.substring(colonIdx + 1).trim();
      const baseKey = rawKey.split(';')[0]; // strip TYPE= params
      const paramStr = rawKey.substring(baseKey.length);

      // Prioritise PREF or WORK for email/tel when multiple exist
      const isPref = paramStr.includes('PREF') || paramStr.includes('WORK');
      const existing = fields.get(baseKey) ?? [];
      if (isPref || existing.length === 0) {
        fields.set(baseKey, [value, ...existing]);
      } else {
        existing.push(value);
        fields.set(baseKey, existing);
      }
    }

    const first = (key: string) => fields.get(key)?.[0] ?? '';

    const name = decodeVCardValue(first('FN'));
    if (!name) continue;

    // LinkedIn — usually in URL field
    const urls = fields.get('URL') ?? [];
    const linkedin = urls.find(u => u.includes('linkedin.com')) ?? '';

    // Organisation may be "Company;Department" — take company part
    const orgRaw = decodeVCardValue(first('ORG'));
    const organization = orgRaw.split(';')[0].trim();

    contacts.push(makeContact({
      name,
      organization,
      role: decodeVCardValue(first('TITLE')),
      email: first('EMAIL'),
      phone: first('TEL'),
      linkedin,
    }));
  }

  return contacts;
}

/** Unfold vCard continuation lines (lines starting with space/tab) */
function unfoldVCardLines(text: string): string[] {
  const unfolded = text.replace(/\r?\n[ \t]/g, '');
  return unfolded.split(/\r?\n/).map(l => l.trim());
}

/** Decode vCard escape sequences and charset quirks */
function decodeVCardValue(value: string): string {
  return value
    .replace(/\\n/gi, ' ')
    .replace(/\\,/g, ',')
    .replace(/\\;/g, ';')
    .replace(/\\:/g, ':')
    .replace(/\\\\/g, '\\')
    .replace(/=\r?\n/g, '') // quoted-printable soft line breaks
    .trim();
}

// ─── CSV parser ─────────────────────────────────────────────────────────────

/**
 * Parse a contacts CSV file — auto-detects Gmail, Outlook, or generic format.
 */
export function parseContactsCSV(text: string): ImportedContact[] {
  const rows = text.split(/\r?\n/).filter(l => l.trim());
  if (rows.length < 2) return [];

  const headers = parseCSVRow(rows[0]).map(h => h.trim());
  const format = detectCSVFormat(headers);
  const contacts: ImportedContact[] = [];

  for (let i = 1; i < rows.length; i++) {
    const values = parseCSVRow(rows[i]);
    if (values.every(v => !v.trim())) continue;

    const get = (key: string): string => {
      const idx = headers.indexOf(key);
      return idx >= 0 ? (values[idx] ?? '').trim() : '';
    };

    const getFirst = (...keys: string[]): string => {
      for (const key of keys) {
        const val = get(key);
        if (val) return val;
      }
      return '';
    };

    let name = '';
    let organization = '';
    let role = '';
    let email = '';
    let phone = '';
    let linkedin = '';

    if (format === 'gmail') {
      name = get('Name') || [get('Given Name'), get('Family Name')].filter(Boolean).join(' ');
      organization = get('Organization 1 - Name');
      role = get('Organization 1 - Title');
      email = getFirst('E-mail 1 - Value', 'E-mail 2 - Value');
      phone = getFirst('Phone 1 - Value', 'Phone 2 - Value');
      // Gmail stores websites separately — scan all website columns
      const websiteKeys = headers.filter(h => h.startsWith('Website') || h.includes('Website'));
      linkedin = websiteKeys.map(k => get(k)).find(v => v.includes('linkedin.com')) ?? '';
    } else if (format === 'outlook') {
      name = [get('First Name'), get('Last Name')].filter(Boolean).join(' ') || get('Name');
      organization = getFirst('Company', 'Organization');
      role = getFirst('Job Title', 'Title');
      email = getFirst('E-mail Address', 'E-mail 2 Address', 'E-mail 3 Address');
      phone = getFirst('Mobile Phone', 'Business Phone', 'Home Phone', 'Primary Phone');
      linkedin = getFirst('LinkedIn', 'Web Page');
      if (linkedin && !linkedin.includes('linkedin.com')) linkedin = '';
    } else {
      // Generic — try every common column name variation
      name = getFirst('Name', 'Full Name', 'Contact Name', 'Display Name') ||
        [getFirst('First Name', 'Given Name'), getFirst('Last Name', 'Family Name', 'Surname')]
          .filter(Boolean).join(' ');
      organization = getFirst('Company', 'Organization', 'Organisation', 'Employer', 'Work');
      role = getFirst('Job Title', 'Title', 'Position', 'Role');
      email = getFirst('Email', 'E-mail', 'Email Address', 'E-mail Address');
      phone = getFirst('Phone', 'Mobile', 'Cell', 'Mobile Phone', 'Phone Number');
      const possibleLinkedIn = getFirst('LinkedIn', 'LinkedIn URL', 'Website', 'URL', 'Web Page');
      linkedin = possibleLinkedIn.includes('linkedin.com') ? possibleLinkedIn : '';
    }

    if (!name) continue;

    contacts.push(makeContact({ name, organization, role, email, phone, linkedin }));
  }

  return contacts;
}

type CSVFormat = 'gmail' | 'outlook' | 'generic';

function detectCSVFormat(headers: string[]): CSVFormat {
  const has = (h: string) => headers.includes(h);
  if (has('Given Name') || has('E-mail 1 - Value') || has('Organization 1 - Name')) return 'gmail';
  if (has('First Name') && (has('E-mail Address') || has('Company'))) return 'outlook';
  return 'generic';
}

/** Spec-compliant CSV row parser — handles quoted fields and escaped quotes */
function parseCSVRow(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    const next = line[i + 1];

    if (ch === '"' && inQuotes && next === '"') {
      current += '"';
      i++;
    } else if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

// ─── Shared contact factory ──────────────────────────────────────────────────

interface RawContact {
  name: string;
  organization: string;
  role: string;
  email: string;
  phone: string;
  linkedin: string;
}

function makeContact({ name, organization, role, email, phone, linkedin }: RawContact): ImportedContact {
  return {
    _imported: true,
    name: name.trim(),
    organization: organization.trim() || undefined,
    role: role.trim() || undefined,
    // Ubuntu-specific fields — must be filled in by the Integrator
    currentPursuit: '',
    whyTheyMatter: '',
    trustLevel: 3,
    trustNote: '',
    tier: 'warm',
    tags: [],
    contactInfo: {
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      linkedin: linkedin.trim() || undefined,
    },
  };
}

// ─── File dispatcher ─────────────────────────────────────────────────────────

/**
 * Parse a file by extension — returns array of imported contacts.
 */
export function parseContactFile(filename: string, text: string): ImportedContact[] {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (ext === 'vcf' || ext === 'vcard') return parseVCard(text);
  if (ext === 'csv') return parseContactsCSV(text);
  return [];
}
