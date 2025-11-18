import { NextRequest, NextResponse } from 'next/server';
import { SuburiEntry } from '@/types';

// Note: This shares data with the entries route in development
// In production, use a shared database

export async function GET(request: NextRequest) {
  // Fetch from entries endpoint
  const baseUrl = request.nextUrl.origin;
  const searchParams = request.nextUrl.searchParams;

  const response = await fetch(`${baseUrl}/api/entries?${searchParams.toString()}`);
  const entries: SuburiEntry[] = await response.json();

  // Aggregate by name for rankings
  const aggregated = entries.reduce((acc, entry) => {
    if (!acc[entry.name]) {
      acc[entry.name] = {
        name: entry.name,
        club: entry.club || 'Unknown',
        totalCount: 0,
        sessions: 0,
        lastActive: entry.date,
        firstActive: entry.date,
      };
    }
    acc[entry.name].totalCount += entry.count;
    acc[entry.name].sessions += 1;
    if (entry.date > acc[entry.name].lastActive) {
      acc[entry.name].lastActive = entry.date;
      acc[entry.name].club = entry.club || acc[entry.name].club; // Use most recent club
    }
    if (entry.date < acc[entry.name].firstActive) {
      acc[entry.name].firstActive = entry.date;
    }
    return acc;
  }, {} as Record<string, { name: string; club: string; totalCount: number; sessions: number; lastActive: string; firstActive: string }>);

  const rankings = Object.values(aggregated)
    .sort((a, b) => b.totalCount - a.totalCount)
    .map((entry, index) => ({
      rank: index + 1,
      ...entry,
    }));

  return NextResponse.json(rankings);
}
