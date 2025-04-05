import { z } from 'zod'
import { Base } from '../entity/base'

// Schema
export const roleSchema = z.object({
  name: z
    .string({ required_error: 'name is required' })
    .min(3, { message: 'name must be at least 3 characters long' })
    .max(255, { message: 'name must be at most 255 characters long' }),
})

// Type
export type RoleSchema = z.infer<typeof roleSchema> &
  Base & {
    deleted_at: Date | null
  }
