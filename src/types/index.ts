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
  // Raffy variations
  'rafa': 'Raffy',
  'raffy': 'Raffy',

  // Angelo Ampil variations
  'angelo': 'Angelo Ampil',
  'angelo ampil': 'Angelo Ampil',
  'angelo tablante ampil': 'Angelo Ampil',

  // Elvie variations
  'elvie': 'Elvie',
  'elvie inoue': 'Elvie',

  // Verns variations
  'verns': 'Verns Chiongbian',
  'verns chiongbian': 'Verns Chiongbian',

  // Shane variations
  'shane': 'Shane Chiongbian',
  'shane chiongbian': 'Shane Chiongbian',

  // Chichay variations
  'chichay sison': 'Chichay Sison',

  // Nicanor variations (including typo fix)
  'nicanor padilla iv': 'Nicanor Padilla IV',
  'nicanor padulla iv': 'Nicanor Padilla IV',

  // Juancho variations
  'juancho macalla': 'Juancho Macalla',
  'juancho gabriel macalla': 'Juancho Macalla',

  // Kyrios variations
  'kyrios zipagan': 'Kyrios Zipagan',
  'kyrios "cutie"': 'Kyrios Zipagan',

  // Ten variations
  'ten (ikc)': 'Ten (IKC)',
  'ten (iloilo kendo club)': 'Ten (IKC)',

  // MJ variations
  'mj ng cha': 'MJ Ng Cha',
  'mj (yushinkai)': 'MJ (Yushinkai)',

  // Viridian Gym variations - keep as group entries
  'viridian gym': 'Viridian Gym',
  'viridian gym (d+z)': 'Viridian Gym',
  'viridian gym (denise+zach)': 'Viridian Gym',
  'viridian gym (z)': 'Viridian Gym',
  'viridian gym (z+his kouhai-tachi)': 'Viridian Gym',

  // Other normalizations
  'jozef': 'Jozef',
  'noel': 'Noel',
  'ejay': 'Ejay',
  'angge': 'Angge',
  'janelle': 'Janelle',
  'neo': 'Neo',
  'ethan': 'Ethan',
  'erica': 'Erica',
  'eden': 'Eden',
  'prince': 'Prince',
  'robert': 'Robert',
  'quincy': 'Quincy',
  'ice': 'Ice',
  'ginn': 'Ginn',
  'suji': 'Suji',
  'kutch': 'Kutch',
  'fids': 'Fids',
  'gek': 'Gek',
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
