import { z } from 'zod';
import { createEndpoint } from 'zite-integrations-backend-sdk';

export default createEndpoint({
  description: 'Fetch fabrication locations for a city from Supabase',
  inputSchema: z.object({
    city: z.string(),
  }),
  outputSchema: z.object({
    locations: z.array(z.object({
      id: z.string(),
      name: z.string(),
      latitude: z.number(),
      longitude: z.number(),
      type: z.string(),
      capabilities: z.array(z.string()),
      membershipCost: z.string(),
      sourceLink: z.string(),
      notes: z.string(),
    })),
  }),
  execute: async ({ input }) => {
    const url = process.env.ZITE_SUPABASE_URL ?? '';
    const key = process.env.ZITE_SUPABASE_ANON_KEY ?? '';

    const res = await fetch(
      `${url}/rest/v1/locations?city=eq.${encodeURIComponent(input.city)}&select=*&order=name.asc`,
      {
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!res.ok) {
      return { locations: [] };
    }

    const data = await res.json();
    const rows = Array.isArray(data) ? data : [];

    const locations = rows.map((r: Record<string, unknown>) => ({
      id: String(r.id ?? ''),
      name: String(r.name ?? ''),
      latitude: Number(r.lat ?? 0),
      longitude: Number(r.lng ?? 0),
      type: r.type === 'library' ? 'Library' : r.type === 'makerspace' ? 'Makerspace' : String(r.type ?? 'Makerspace'),
      capabilities: Array.isArray(r.capabilities) ? (r.capabilities as string[]) : [],
      membershipCost: String(r.membership_info ?? ''),
      sourceLink: String(r.source_url ?? ''),
      notes: String(r.description ?? ''),
    }));

    return { locations };
  },
});
