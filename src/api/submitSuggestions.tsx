import { z } from 'zod';
import { createEndpoint, Submissions } from 'zite-integrations-backend-sdk';

export default createEndpoint({
  description: 'Stores a user suggestion for a new or updated location',
  inputSchema: z.object({
    locationName: z.string(),
    suggestedChange: z.string(),
    sourceUrl: z.string(),
    notes: z.string().optional(),
  }),
  outputSchema: z.object({ success: z.boolean() }),
  execute: async ({ input }) => {
    await Submissions.create({
      record: {
        locationName: input.locationName,
        suggestedChange: input.suggestedChange,
        sourceUrl: input.sourceUrl,
        notes: input.notes ?? '',
        submittedAt: new Date().toISOString(),
      },
    });
    return { success: true };
  },
});
