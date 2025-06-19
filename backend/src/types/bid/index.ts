import { z } from 'zod';

export const bidSchema = z.object({
  projectId: z.string().uuid(),
  amount: z.number().positive(),
  estimatedTime: z.string(),
  message: z.string(),
});
