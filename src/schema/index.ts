import { z } from 'zod';

export const user = z.object({
  name: z.string(),
});

export const userWithId = user.extend({
  id: z.string(),
  latitude: z.number(),
  longitude: z.number(),
});

export const health = z.object({
  userId: z.number(),
  spo2: z.number(),
  bpm: z.number(),
  exercise: z.string().max(255, 'Too long!'),
});
