# Porting fabnetwork to bolt.new / local development

This guide walks you through removing Zite-specific dependencies so you can
run this app locally with Next.js (App Router) or Vite + Express.

---

## What needs to change

There are exactly **3 Zite-specific things** in this codebase:

| File | Zite dependency | What it does |
|---|---|---|
| `src/lib/api.ts` | `zite-endpoints-sdk` | Calls backend API functions |
| `src/api/*.ts` | `zite-integrations-backend-sdk` → `createEndpoint` | Defines backend API handlers |
| `src/index.css` | Google Fonts import | Fine as-is, no changes needed |

Everything else (React, Tailwind, shadcn/ui, Leaflet, Lucide) is standard and portable.

---

## Option A — Next.js App Router (recommended)

### 1. Scaffold the project

```bash
npx create-next-app@latest fabnetwork --typescript --tailwind --app
cd fabnetwork
```

Install dependencies:
```bash
npm install lucide-react framer-motion zod date-fns use-debounce
npm install sonner
npx shadcn@latest init
npx shadcn@latest add dialog input textarea label button
```

### 2. Copy files

Copy these directories/files into your Next.js project:
```
src/app/           ← create this (see below)
src/components/    ← copy as-is (delete SeedRunner.tsx unless you need it)
src/data/          ← copy as-is
src/lib/           ← copy, then edit api.ts (see step 3)
src/index.css      ← copy into src/app/globals.css
tailwind.config.ts ← copy as-is
```

### 3. Replace `src/lib/api.ts`

Replace the entire file with direct fetch calls:

```typescript
// src/lib/api.ts

export interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: 'Library' | 'Makerspace' | string;
  capabilities: string[];
  membershipCost: string;
  sourceLink: string;
  notes: string;
}

export interface SuggestionPayload {
  locationName: string;
  suggestedChange: string;
  sourceUrl: string;
  notes?: string;
  city?: string;
}

export async function fetchLocationsByCity(cityName: string): Promise<Location[]> {
  const res = await fetch(`/api/locations?city=${encodeURIComponent(cityName)}`);
  const data = await res.json();
  return data.locations;
}

export async function submitLocationSuggestion(payload: SuggestionPayload) {
  const res = await fetch('/api/suggestions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json() as Promise<{ success: boolean }>;
}

export async function runDatabaseSeed(secret: string) {
  const res = await fetch('/api/seed', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret }),
  });
  return res.json() as Promise<{ inserted: number; errors: number }>;
}
```

### 4. Create Next.js API routes

**`src/app/api/locations/route.ts`**
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const city = request.nextUrl.searchParams.get('city') ?? '';
  const supabaseUrl = process.env.SUPABASE_URL ?? '';
  const supabaseKey = process.env.SUPABASE_ANON_KEY ?? '';

  const res = await fetch(
    `${supabaseUrl}/rest/v1/locations?city=eq.${encodeURIComponent(city)}&select=*&order=name.asc`,
    { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` } }
  );

  const rows = await res.json();
  const locations = rows.map((r: any) => ({
    id: String(r.id ?? ''),
    name: String(r.name ?? ''),
    latitude: Number(r.lat ?? 0),
    longitude: Number(r.lng ?? 0),
    type: r.type === 'library' ? 'Library' : 'Makerspace',
    capabilities: Array.isArray(r.capabilities) ? r.capabilities : [],
    membershipCost: String(r.membership_info ?? ''),
    sourceLink: String(r.source_url ?? ''),
    notes: String(r.description ?? ''),
  }));

  return NextResponse.json({ locations });
}
```

**`src/app/api/suggestions/route.ts`**
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const supabaseUrl = process.env.SUPABASE_URL ?? '';
  const supabaseKey = process.env.SUPABASE_ANON_KEY ?? '';

  const res = await fetch(`${supabaseUrl}/rest/v1/submissions`, {
    method: 'POST',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({
      location_name: body.locationName,
      suggested_change: body.suggestedChange,
      source_url: body.sourceUrl,
      notes: body.notes ?? '',
      city: body.city ?? '',
    }),
  });

  return NextResponse.json({ success: res.ok });
}
```

**`src/app/api/seed/route.ts`**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { ALL_LOCATIONS } from '@/data/seedData'; // move the array here

export async function POST(request: NextRequest) {
  const { secret } = await request.json();
  if (secret !== 'seed-fabnetwork-2025') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabaseUrl = process.env.SUPABASE_URL ?? '';
  const supabaseKey = process.env.SUPABASE_ANON_KEY ?? '';

  const res = await fetch(`${supabaseUrl}/rest/v1/locations`, {
    method: 'POST',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify(ALL_LOCATIONS),
  });

  return NextResponse.json({
    inserted: res.ok ? ALL_LOCATIONS.length : 0,
    errors: res.ok ? 0 : 1,
  });
}
```

### 5. Environment variables

Create `.env.local`:
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

> Note: In Zite these were named `ZITE_SUPABASE_URL` and `ZITE_SUPABASE_ANON_KEY`.
> In Next.js, remove the `ZITE_` prefix (or keep it — just be consistent).

### 6. Create `src/app/page.tsx`

```typescript
import App from '@/components/App'; // move App.tsx into components/
export default function Page() { return <App />; }
```

And `src/app/layout.tsx`:
```typescript
import './globals.css';
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
```

---

## Option B — Vite + Express

If you prefer a Vite frontend with a lightweight Express backend:

1. Keep the entire `src/` frontend as-is
2. Replace `src/lib/api.ts` the same way as Option A (direct fetch calls)
3. Create `server/index.ts` with Express routes mirroring the logic above
4. Set `VITE_API_URL` and prefix fetch calls with `import.meta.env.VITE_API_URL`

---

## Supabase setup checklist

Before running locally, make sure your Supabase `locations` table has these columns:

| Column | Type |
|---|---|
| id | int8 (identity / primary key) |
| name | text |
| city | text |
| lat | float8 |
| lng | float8 |
| type | text |
| capabilities | jsonb |
| membership_info | text |
| source_url | text |
| description | text |

And either:
- **Disable RLS** on `locations` and `submissions` for local dev, OR
- Add `SELECT` and `INSERT` policies set to `true` for the anon role

---

## What does NOT need to change

- All React components (`LocationCard`, `LocationDrawer`, `MapView`, etc.)
- All Tailwind/CSS theme variables
- All city data (`src/data/cities.ts`)
- shadcn/ui components
- The Leaflet map integration
