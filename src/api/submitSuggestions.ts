import { z } from 'zod';
import { createEndpoint } from 'zite-integrations-backend-sdk';

export default createEndpoint({
  description: 'Store a user suggestion in Supabase for review',
  inputSchema: z.object({
    locationName: z.string(),
    suggestedChange: z.string(),
    sourceUrl: z.string(),
    notes: z.string().optional(),
    city: z.string().optional(),
  }),
  outputSchema: z.object({ success: z.boolean() }),
  execute: async ({ input }) => {
    const url = process.env.ZITE_SUPABASE_URL ?? '';
    const key = process.env.ZITE_SUPABASE_ANON_KEY ?? '';

    const res = await fetch(`${url}/rest/v1/submissions`, {
      method: 'POST',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        location_name: input.locationName,
        suggested_change: input.suggestedChange,
        source_url: input.sourceUrl,
        notes: input.notes ?? '',
        city: input.city ?? '',
      }),
    });

    return { success: res.ok };
  },
});
