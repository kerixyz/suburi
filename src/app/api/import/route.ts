import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Read file buffer
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });

    // Get first sheet
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const rawData = XLSX.utils.sheet_to_json(sheet);

    if (!rawData.length) {
      return NextResponse.json({ error: 'No data found in Excel file' }, { status: 400 });
    }

    // Map Excel columns to our format
    // Support various column name formats
    const entries = rawData.map((row: any) => {
      // Try to find name column
      const name = row.Name || row.name || row.NAME || row.Person || row.person || 'Unknown';

      // Try to find count column
      const count = parseInt(
        row.Count || row.count || row.COUNT ||
        row.Swings || row.swings || row.SWINGS ||
        row.Suburi || row.suburi || row.SUBURI ||
        row.Number || row.number || '0'
      ) || 0;

      // Try to find date column
      let date = row.Date || row.date || row.DATE || row.Day || row.day;

      // Handle Excel date serial numbers
      if (typeof date === 'number') {
        const excelDate = XLSX.SSF.parse_date_code(date);
        date = `${excelDate.y}-${String(excelDate.m).padStart(2, '0')}-${String(excelDate.d).padStart(2, '0')}`;
      } else if (date instanceof Date) {
        date = date.toISOString().split('T')[0];
      } else if (typeof date === 'string') {
        // Try to parse various date formats
        const parsed = new Date(date);
        if (!isNaN(parsed.getTime())) {
          date = parsed.toISOString().split('T')[0];
        } else {
          date = new Date().toISOString().split('T')[0];
        }
      } else {
        date = new Date().toISOString().split('T')[0];
      }

      // Try to find location columns
      const city = row.City || row.city || row.CITY || null;
      const country = row.Country || row.country || row.COUNTRY || null;

      return {
        name,
        count,
        date,
        location: city && country ? { city, country } : null,
      };
    }).filter((entry: any) => entry.count > 0); // Filter out entries with 0 count

    // Import entries via the entries API
    const baseUrl = request.nextUrl.origin;
    const results = await Promise.all(
      entries.map(async (entry: any) => {
        const response = await fetch(`${baseUrl}/api/entries`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry),
        });
        return response.ok;
      })
    );

    const successCount = results.filter(Boolean).length;

    return NextResponse.json({
      success: true,
      message: `Imported ${successCount} of ${entries.length} entries`,
      imported: successCount,
      total: entries.length,
    });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { error: 'Failed to import file' },
      { status: 500 }
    );
  }
}
