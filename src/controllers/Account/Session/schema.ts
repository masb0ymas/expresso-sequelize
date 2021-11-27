import * as yup from 'yup'

const create = yup
  .object()
  .shape({
    UserId: yup.string().required('user id is required'),
    token: yup.string().required('token is required'),
    ipAddress: yup.string().nullable(),
    device: yup.string().nullable(),
    platform: yup.string().nullable(),
    latitude: yup.string().nullable(),
    longitude: yup.string().nullable(),
  })
  .required()

const sessionSchema = { create }

export default sessionSchema
