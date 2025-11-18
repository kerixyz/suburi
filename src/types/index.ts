export interface SuburiEntry {
  id: string;
  name: string;
  club: string;
  count: number;
  date: string; // YYYY-MM-DD format
  metadata: {
    addedAt: string; // ISO timestamp
    location: {
      city: string;
      country: string;
    } | null;
    userAgent?: string;
  };
}

export interface RankingFilter {
  startDate?: string;
  endDate?: string;
  sortBy: 'count' | 'date' | 'name';
  sortOrder: 'asc' | 'desc';
}

// Name normalization mapping
export const NAME_ALIASES: Record<string, string> = {
  'rafa': 'Raffy',
  'raffy': 'Raffy',
  'angelo': 'Angelo',
  'angelo .': 'Angelo',
  'angelo ..': 'Angelo',
  'angelo angelo': 'Angelo',
};

// Normalize a name using the alias map
export function normalizeName(name: string): string {
  const trimmed = name.trim();
  const lower = trimmed.toLowerCase();

  // Check exact match in aliases
  if (NAME_ALIASES[lower]) {
    return NAME_ALIASES[lower];
  }

  // Check for partial matches (e.g., "angelo  " with extra spaces)
  const normalized = lower.replace(/\s+/g, ' ').replace(/\.+/g, '').trim();
  if (NAME_ALIASES[normalized]) {
    return NAME_ALIASES[normalized];
  }

  // Default: capitalize first letter of each word
  return trimmed
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
