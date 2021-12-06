import * as yup from 'yup'

const create = yup.object().shape({
  UserId: yup.string().required('user is required'),
  token: yup.string().required('token is required'),
})

const fcmTokenSchema = { create }

export default fcmTokenSchema
