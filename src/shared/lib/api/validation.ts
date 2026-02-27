import { z } from 'zod';

/**
 * Example validation schemas.
 * Replace these with your own domain-specific schemas.
 */

export const exampleCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional(),
});

export type ExampleCreateInput = z.infer<typeof exampleCreateSchema>;
