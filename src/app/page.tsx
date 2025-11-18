'use client';

import { useState, useEffect, useCallback } from 'react';
import { SuburiEntry } from '@/types';

interface LocationInfo {
  city: string;
  country: string;
}

interface RankingEntry {
  rank: number;
  name: string;
  totalCount: number;
  sessions: number;
  lastActive: string;
  firstActive: string;
}

export default function Home() {
  // Form state
  const [name, setName] = useState('');
  const [count, setCount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');

  // Data state
  const [entries, setEntries] = useState<SuburiEntry[]>([]);
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(false);

  // Filter state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Active tab
  const [activeTab, setActiveTab] = useState<'add' | 'entries' | 'rankings'>('add');

  // Import state
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<string | null>(null);

  // Fetch location on mount
  useEffect(() => {
    fetchLocation();
  }, []);

  // Fetch entries and rankings
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (startDate) params.set('startDate', startDate);
      if (endDate) params.set('endDate', endDate);
      params.set('sortBy', sortBy);
      params.set('sortOrder', sortOrder);

      const [entriesRes, rankingsRes] = await Promise.all([
        fetch(`/api/entries?${params.toString()}`),
        fetch(`/api/rankings?${params.toString()}`),
      ]);

      setEntries(await entriesRes.json());
      setRankings(await rankingsRes.json());
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, sortBy, sortOrder]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchLocation = async () => {
    setLocationLoading(true);
    setLocationError('');

    try {
      // Use IP-based geolocation API
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();

      if (data.city && data.country_name) {
        setLocation({
          city: data.city,
          country: data.country_name,
        });
      } else {
        setLocationError('Could not determine location');
      }
    } catch (error) {
      setLocationError('Failed to fetch location');
      console.error('Location error:', error);
    } finally {
      setLocationLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !count || !date) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          count: parseInt(count),
          date,
          location,
        }),
      });

      if (response.ok) {
        setName('');
        setCount('');
        setDate(new Date().toISOString().split('T')[0]);
        fetchData();
        alert('Entry added successfully!');
      }
    } catch (error) {
      console.error('Failed to add entry:', error);
      alert('Failed to add entry');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;

    try {
      await fetch(`/api/entries?id=${id}`, { method: 'DELETE' });
      fetchData();
    } catch (error) {
      console.error('Failed to delete entry:', error);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/import', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setImportResult(`Success! ${result.message}`);
        fetchData();
      } else {
        setImportResult(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Import error:', error);
      setImportResult('Failed to import file');
    } finally {
      setImporting(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (isoStr: string) => {
    return new Date(isoStr).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Suburi Counter
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your sword practice swings
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          {(['add', 'entries', 'rankings'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              {tab === 'add' ? 'Add Entry' : tab}
            </button>
          ))}
        </div>

        {/* Add Entry Form */}
        {activeTab === 'add' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Add Suburi Count
            </h2>

            {/* Location Display */}
            <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {locationLoading ? (
                  'Detecting location...'
                ) : location ? (
                  <>
                    Location: <span className="font-medium">{location.city}, {location.country}</span>
                  </>
                ) : (
                  <>
                    {locationError || 'Location not available'}
                    <button
                      onClick={fetchLocation}
                      className="ml-2 text-blue-500 hover:underline"
                    >
                      Retry
                    </button>
                  </>
                )}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Suburi Count
                </label>
                <input
                  type="number"
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Number of swings"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Add Entry
              </button>
            </form>

            {/* Import from Excel */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Import from Excel
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Upload an Excel file (.xlsx, .xls) with columns: Name, Count/Swings, Date
              </p>
              <label className="block">
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleImport}
                  disabled={importing}
                  className="block w-full text-sm text-gray-500 dark:text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-medium
                    file:bg-green-50 file:text-green-700
                    hover:file:bg-green-100
                    dark:file:bg-green-900 dark:file:text-green-300
                    disabled:opacity-50"
                />
              </label>
              {importing && (
                <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                  Importing...
                </p>
              )}
              {importResult && (
                <p className={`mt-2 text-sm ${
                  importResult.startsWith('Success')
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {importResult}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Entries List */}
        {activeTab === 'entries' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            {/* Filters */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                  >
                    <option value="date">Date</option>
                    <option value="count">Count</option>
                    <option value="name">Name</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Order
                  </label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Entries */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <div className="p-8 text-center text-gray-500">Loading...</div>
              ) : entries.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No entries yet. Add your first suburi count!
                </div>
              ) : (
                entries.map((entry) => (
                  <div key={entry.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {entry.name}
                          </span>
                          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {entry.count}
                          </span>
                          <span className="text-sm text-gray-500">swings</span>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {formatDate(entry.date)}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          Added {entry.metadata.location ? (
                            <>from {entry.metadata.location.city}, {entry.metadata.location.country}</>
                          ) : (
                            <>from unknown location</>
                          )} on {formatDateTime(entry.metadata.addedAt)}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Rankings */}
        {activeTab === 'rankings' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            {/* Filters */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              {(startDate || endDate) && (
                <button
                  onClick={() => {
                    setStartDate('');
                    setEndDate('');
                  }}
                  className="mt-2 text-sm text-blue-500 hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* Rankings Table */}
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-8 text-center text-gray-500">Loading...</div>
              ) : rankings.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No rankings yet. Add some entries to see the leaderboard!
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Rank
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Total Swings
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Sessions
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Active Period
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {rankings.map((entry) => (
                      <tr key={entry.name} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                            entry.rank === 1
                              ? 'bg-yellow-100 text-yellow-800'
                              : entry.rank === 2
                              ? 'bg-gray-100 text-gray-800'
                              : entry.rank === 3
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-gray-50 text-gray-600'
                          }`}>
                            {entry.rank}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                          {entry.name}
                        </td>
                        <td className="px-4 py-3 text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {entry.totalCount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                          {entry.sessions}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(entry.firstActive)} - {formatDate(entry.lastActive)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Practice your suburi daily and track your progress!</p>
        </div>
      </div>
    </main>
  );
}
