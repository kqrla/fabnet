import { z } from 'zod';
import { createEndpoint, Locations } from 'zite-integrations-backend-sdk';

export default createEndpoint({
  description: 'Returns all fabrication locations in SF',
  inputSchema: z.object({}),
  outputSchema: z.object({
    locations: z.array(z.object({
      id: z.string(),
      name: z.string().optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
      type: z.string().optional(),
      capabilities: z.array(z.string()).optional(),
      membershipCost: z.string().optional(),
      sourceLink: z.string().optional(),
      notes: z.string().optional(),
    })),
  }),
  execute: async () => {
    const { records } = await Locations.findAll({ limit: 500 });
    return { locations: records };
  },
});
