import * as yup from 'yup'

const create = yup.object().shape({
  UserId: yup.string().required('user is required'),
  token: yup.string().required('token is required'),
  ipAddress: yup.string().nullable(),
  device: yup.string().nullable(),
  platform: yup.string().nullable(),
})

export default {
  create,
}
