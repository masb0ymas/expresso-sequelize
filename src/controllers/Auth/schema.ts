import * as yup from 'yup'

const register = yup
  .object()
  .shape({
    fullName: yup.string().required('fullname is required'),
    email: yup.string().email('invalid email').required('email is required'),
    phone: yup.string().required('phone is required'),
    active: yup.boolean().nullable(),
    tokenVerify: yup.string().nullable(),
    newPassword: yup
      .string()
      .min(8, 'at least 8 characters')
      .oneOf([yup.ref('confirmNewPassword')], 'passwords are not the same'),
    confirmNewPassword: yup
      .string()
      .min(8, 'at least 8 characters')
      .oneOf([yup.ref('newPassword')], 'passwords are not the same'),
  })
  .required()

const login = yup
  .object()
  .shape({
    email: yup.string().required('email is required'),
    password: yup.string().required('password is required'),
  })
  .required()

export default { register, login }
