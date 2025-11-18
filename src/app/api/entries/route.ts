import { NextRequest, NextResponse } from 'next/server';
import { SuburiEntry, normalizeName } from '@/types';

// In-memory storage (in production, use a database)
// For Vercel deployment, consider using Vercel KV, Postgres, or external DB
let entries: SuburiEntry[] = [];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const sortBy = searchParams.get('sortBy') || 'date';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  let filteredEntries = [...entries];

  // Apply date filters
  if (startDate) {
    filteredEntries = filteredEntries.filter(e => e.date >= startDate);
  }
  if (endDate) {
    filteredEntries = filteredEntries.filter(e => e.date <= endDate);
  }

  // Sort entries
  filteredEntries.sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'count':
        comparison = a.count - b.count;
        break;
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'date':
      default:
        comparison = a.date.localeCompare(b.date);
        break;
    }
    return sortOrder === 'desc' ? -comparison : comparison;
  });

  return NextResponse.json(filteredEntries);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const newEntry: SuburiEntry = {
    id: crypto.randomUUID(),
    name: normalizeName(body.name),
    club: body.club || 'Unknown',
    count: body.count,
    date: body.date,
    metadata: {
      addedAt: new Date().toISOString(),
      location: body.location || null,
      userAgent: request.headers.get('user-agent') || undefined,
    },
  };

  entries.push(newEntry);

  return NextResponse.json(newEntry, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
  }

  const index = entries.findIndex(e => e.id === id);
  if (index === -1) {
    return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
  }

  entries.splice(index, 1);
  return NextResponse.json({ success: true });
}
