import * as yup from 'yup'

const create = yup.object().shape({
  UserId: yup.string().required('User Id is required'),
  token: yup.string().required('token is required'),
})

export default {
  create,
}
