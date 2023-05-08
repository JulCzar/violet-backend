import { z } from 'zod';

export const user = z.object({
  name: z.string(),
});

export const userUpdate = user.extend({
  name: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const health = z.object({
  userId: z.number(),
  spo2: z.number(),
  bpm: z.number(),
  exercise: z.string().max(255, 'Too long!'),
});

export const healthUpdate = z.object({
  userId: z.number().optional(),
  spo2: z.number().optional(),
  bpm: z.number().optional(),
  exercise: z.string().max(255, 'Too long!').optional(),
});
