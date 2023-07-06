import { z } from 'zod'

const create = z.object({
  user_id: z
    .string({
      required_error: 'user_id is required',
      invalid_type_error: 'user_id must be a string',
    })
    .uuid({ message: 'user_id invalid uuid format' })
    .min(2, `user_id can't be empty`),

  token: z
    .string({
      required_error: 'token is required',
      invalid_type_error: 'token must be a string',
    })
    .min(2, `token can't be empty`),

  ip_address: z
    .string({
      required_error: 'ip_address is required',
      invalid_type_error: 'ip_address must be a string',
    })
    .min(2, `ip_address can't be empty`),

  device: z
    .string({
      required_error: 'device is required',
      invalid_type_error: 'device must be a string',
    })
    .min(2, `device can't be empty`),

  platform: z
    .string({
      required_error: 'platform is required',
      invalid_type_error: 'platform must be a string',
    })
    .min(2, `platform can't be empty`),

  latitude: z.string().nullable(),
  longitude: z.string().nullable(),
})

const sessionSchema = { create }

export default sessionSchema
