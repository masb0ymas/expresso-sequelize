import * as yup from 'yup'

const create = yup.object().shape({
  fullName: yup.string().required('fullname is required'),
  email: yup.string().email('invalid email').required('email is required'),
  phone: yup.string().required('phone is required'),
  isActive: yup.boolean().nullable(),
  isBlocked: yup.boolean().nullable(),
  tokenVerify: yup.string().nullable(),
  newPassword: yup
    .string()
    .min(8, 'at least 8 characters')
    .oneOf([yup.ref('confirmNewPassword')], 'passwords are not the same'),
  confirmNewPassword: yup
    .string()
    .min(8, 'at least 8 characters')
    .oneOf([yup.ref('newPassword')], 'passwords are not the same'),
  picturePath: yup.string().nullable(),
  RoleId: yup.string().required('role is required'),
})

const createPassword = yup.object().shape({
  newPassword: yup
    .string()
    .min(8, 'at least 8 characters')
    .oneOf([yup.ref('confirmNewPassword')], 'passwords are not the same'),
  confirmNewPassword: yup
    .string()
    .min(8, 'at least 8 characters')
    .oneOf([yup.ref('newPassword')], 'passwords are not the same'),
})

const userSchema = { create, createPassword }

export default userSchema
