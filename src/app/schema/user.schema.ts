import { z } from 'zod'

const passwordForm = z.object({
  new_password: z.string().min(8, 'new_password at least 8 characters'),
  confirm_new_password: z.string().min(8, 'new_password at least 8 characters'),
})

const createPassword = passwordForm.refine(
  (data) => data.new_password === data.confirm_new_password,
  {
    message: "passwords don't match",
    path: ['confirm_new_password'], // path of error
  }
)

const changePassword = passwordForm
  .extend({
    current_password: z
      .string()
      .min(8, 'current_password at least 8 characters'),
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    message: "passwords don't match",
    path: ['confirm_new_password'], // path of error
  })

const create = passwordForm
  .extend({
    fullname: z
      .string({
        required_error: 'fullname is required',
        invalid_type_error: 'fullname must be a string',
      })
      .min(2, "fullname can't be empty"),

    email: z
      .string({
        required_error: 'email is required',
        invalid_type_error: 'email must be a string',
      })
      .email({ message: 'invalid email address' })
      .min(2, "email can't be empty"),

    phone: z.string().nullable(),
    token_verify: z.string().nullable(),
    upload_id: z
      .string()
      .uuid({ message: 'upload_id invalid uuid format' })
      .nullable(),

    is_active: z.boolean({
      required_error: 'is_active is required',
      invalid_type_error: 'is_active must be a boolean',
    }),

    role_id: z
      .string({
        required_error: 'role_id is required',
        invalid_type_error: 'role_id must be a string',
      })
      .uuid({ message: 'role_id invalid uuid format' })
      .min(2, `role_id can't be empty`),
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    message: "passwords don't match",
    path: ['confirm_new_password'], // path of error
  })

const login = z.object({
  email: z
    .string()
    .email({ message: 'invalid email address' })
    .min(2, "email can't be empty"),

  password: z.string().min(2, "password can't be empty"),
  latitude: z.string().nullable(),
  longitude: z.string().nullable(),
})

const userSchema = {
  create,
  register: create,
  createPassword,
  changePassword,
  login,
}

export default userSchema
