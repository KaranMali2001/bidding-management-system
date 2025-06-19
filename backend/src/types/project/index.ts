import { z } from 'zod';

export const projectSchema = z.object({
  title: z.string(),
  description: z.string(),
  budgetMin: z.number().nonnegative(),
  budgetMax: z.number().nonnegative(),
  deadline: z.string().datetime(),
});
