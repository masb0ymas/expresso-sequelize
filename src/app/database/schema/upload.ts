import { z } from 'zod'
import { BaseSchema } from '../entity/base'

// Schema
export const uploadSchema = z.object({
  keyfile: z
    .string({ required_error: 'keyfile is required' })
    .min(3, { message: 'keyfile must be at least 3 characters long' }),
  filename: z
    .string({ required_error: 'filename is required' })
    .min(3, { message: 'filename must be at least 3 characters long' }),
  mimetype: z
    .string({ required_error: 'mimetype is required' })
    .min(3, { message: 'mimetype must be at least 3 characters long' }),
  size: z
    .number({ required_error: 'size is required' })
    .min(1, { message: 'size must be at least 1' }),
  signed_url: z
    .string({ required_error: 'signed_url is required' })
    .min(3, { message: 'signed_url must be at least 3 characters long' }),
  expiry_date_url: z.date({ required_error: 'expiry_date_url is required' }),
})

// Type
export type UploadSchema = z.infer<typeof uploadSchema> &
  Partial<BaseSchema> & {
    deleted_at?: Date | null
  }
