# Suburi Counter

A web app to track your sword practice swings (suburi) with location metadata and rankings.

## Features

- **Add Entries**: Record your suburi count with name and date
- **Location Metadata**: Automatically detects your location (city, country) when adding entries
- **Rankings**: View leaderboard sorted by total swings
- **Date Filters**: Filter entries and rankings by date range
- **Responsive Design**: Works on desktop and mobile

## Getting Started

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Production Build

```bash
npm run build
npm start
```

## Deploy on Vercel

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import the repository on Vercel
3. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## Note on Data Persistence

This demo uses in-memory storage, which means data will be lost when the server restarts. For production use, consider integrating:

- Vercel KV (Redis)
- Vercel Postgres
- MongoDB Atlas
- Supabase

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Geolocation via ipapi.co
