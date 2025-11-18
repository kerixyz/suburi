export interface SuburiEntry {
  id: string;
  name: string;
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
