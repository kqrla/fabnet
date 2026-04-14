/**
 * api.ts — Portable API client
 *
 * This file is the ONLY place that imports from 'zite-endpoints-sdk'.
 * To port this app to bolt.new / Next.js / Express, you only need to
 * replace the implementations in this file. See PORTING.md for details.
 */

import { getLocations, submitSuggestion, seedSupabase } from 'zite-endpoints-sdk';

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── API calls ────────────────────────────────────────────────────────────────

/**
 * Fetch all fabrication locations for a given city.
 *
 * PORTING: Replace with:
 *   const res = await fetch(`/api/locations?city=${encodeURIComponent(cityName)}`);
 *   return res.json() as Promise<{ locations: Location[] }>;
 */
export async function fetchLocationsByCity(cityName: string): Promise<Location[]> {
  const response = await getLocations({ city: cityName });
  return response.locations as unknown as Location[];
}

/**
 * Submit a user suggestion for a new or updated location.
 *
 * PORTING: Replace with:
 *   const res = await fetch('/api/suggestions', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify(payload),
 *   });
 *   return res.json() as Promise<{ success: boolean }>;
 */
export async function submitLocationSuggestion(payload: SuggestionPayload): Promise<{ success: boolean }> {
  return submitSuggestion(payload);
}

/**
 * Seed the database with all location data (run once).
 *
 * PORTING: Replace with:
 *   const res = await fetch('/api/seed', { method: 'POST' });
 *   return res.json() as Promise<{ inserted: number; errors: number }>;
 */
export async function runDatabaseSeed(secret: string): Promise<{ inserted: number; errors: number }> {
  return seedSupabase({ secret });
}
