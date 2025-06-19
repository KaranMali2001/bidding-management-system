import { z } from 'zod';

export const deliverableSchema = z.object({
  fileUrl: z.string().url(),
});
