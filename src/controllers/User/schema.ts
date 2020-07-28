import * as yup from 'yup'

const create = yup.object().shape({
  fullName: yup.string().required('Nama Lengkap wajib diisi'),
  email: yup.string().email('Email tidak valid').required('Email wajib diisi'),
  phone: yup.string().required('Phone wajib diisi'),
  active: yup.boolean().nullable(),
  tokenVerify: yup.string().nullable(),
  // password: yup.string().defined(),
  newPassword: yup
    .string()
    .min(8, 'Minimal 8 karakter')
    .oneOf([yup.ref('confirmNewPassword')], 'Password tidak sama'),
  confirmNewPassword: yup
    .string()
    .min(8, 'Minimal 8 karakter')
    .oneOf([yup.ref('newPassword')], 'Password tidak sama'),
})

const update = yup.object().shape({
  fullName: yup.string().required('Nama Lengkap wajib diisi'),
  email: yup.string().email('Email tidak valid').required('Email wajib diisi'),
  phone: yup.string().required('Phone wajib diisi'),
  active: yup.boolean().nullable(),
  tokenVerify: yup.string().nullable(),
  // password: yup.string().defined(),
  newPassword: yup
    .string()
    .min(8, 'Minimal 8 karakter')
    .oneOf([yup.ref('confirmNewPassword')], 'Password tidak sama'),
  confirmNewPassword: yup
    .string()
    .min(8, 'Minimal 8 karakter')
    .oneOf([yup.ref('newPassword')], 'Password tidak sama'),
})

const createPassword = yup.object().shape({
  newPassword: yup
    .string()
    .min(8, 'Minimal 8 karakter')
    .oneOf([yup.ref('confirmNewPassword')], 'Password tidak sama'),
  confirmNewPassword: yup
    .string()
    .min(8, 'Minimal 8 karakter')
    .oneOf([yup.ref('newPassword')], 'Password tidak sama'),
})

const createUserRole = yup.object().shape({
  UserId: yup.string().required('User wajib diisi'),
  RoleId: yup.string().required('Role wajib diisi'),
})

export default {
  create,
  createPassword,
  createUserRole,
  update,
}
