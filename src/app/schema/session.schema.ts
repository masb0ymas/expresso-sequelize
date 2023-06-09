import * as yup from 'yup'

const create = yup
  .object({
    user_id: yup.string().required('user id is required'),
    token: yup.string().required('token is required'),
    ip_address: yup.string().required('ip address is required'),
    device: yup.string().required('device is required'),
    platform: yup.string().required('platform is required'),
    latitude: yup.string().nullable(),
    longitude: yup.string().nullable(),
  })
  .required()

const sessionSchema = { create }

export default sessionSchema
