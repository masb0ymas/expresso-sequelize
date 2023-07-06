import { z } from 'zod'

const create = z.object({
  key_file: z
    .string({
      required_error: 'key_file is required',
      invalid_type_error: 'key_file must be a string',
    })
    .min(2, `key_file can't be empty`),

  filename: z
    .string({
      required_error: 'filename is required',
      invalid_type_error: 'filename must be a string',
    })
    .min(2, `filename can't be empty`),

  mimetype: z
    .string({
      required_error: 'mimetype is required',
      invalid_type_error: 'mimetype must be a string',
    })
    .min(2, `mimetype can't be empty`),

  size: z
    .number({
      required_error: 'size is required',
      invalid_type_error: 'size must be a number',
    })
    .min(2, `size can't be empty`),

  signed_url: z
    .string({
      required_error: 'signed_url is required',
      invalid_type_error: 'signed_url must be a string',
    })
    .min(2, `signed_url can't be empty`),

  expiry_date_url: z.date({
    required_error: 'expiry_date_url is required',
    invalid_type_error: 'expiry_date_url must be a date',
  }),
})

const uploadSchema = { create }

export default uploadSchema
