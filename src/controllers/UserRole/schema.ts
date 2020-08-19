import * as yup from 'yup'

const create = yup
  .object()
  .shape({
    UserId: yup.string().required('User wajib diisi'),
    RoleId: yup.string().required('Role wajib diisi'),
  })
  .required()

export default {
  create,
}
