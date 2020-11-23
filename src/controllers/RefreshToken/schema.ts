import * as yup from 'yup'

const create = yup.object().shape({
  UserId: yup.string().required('User wajib diisi'),
  token: yup.string().required('Token wajib diisi'),
})

export default {
  create,
}
