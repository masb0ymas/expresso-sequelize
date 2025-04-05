import { z } from 'zod'
import { BaseSchema } from '../entity/base'

// Schema
export const sessionSchema = z.object({
  user_id: z
    .string({ required_error: 'user_id is required' })
    .uuid({ message: 'user_id must be a valid UUID' }),
  token: z
    .string({ required_error: 'token is required' })
    .min(3, { message: 'token must be at least 3 characters long' }),
  ip_address: z.string({ required_error: 'ip_address is required' }).nullable().optional(),
  device: z.string({ required_error: 'device is required' }).nullable().optional(),
  platform: z.string({ required_error: 'platform is required' }).nullable().optional(),
  user_agent: z.string({ required_error: 'user_agent is required' }).nullable().optional(),
  latitude: z.string({ required_error: 'latitude is required' }).nullable().optional(),
  longitude: z.string({ required_error: 'longitude is required' }).nullable().optional(),
})

// Type
export type SessionSchema = z.infer<typeof sessionSchema> & BaseSchema
