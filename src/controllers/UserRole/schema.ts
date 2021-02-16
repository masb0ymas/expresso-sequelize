import * as yup from 'yup'

const create = yup
  .object()
  .shape({
    UserId: yup.string().required('User Id is required'),
    RoleId: yup.string().required('Role Id is required'),
  })
  .required()

export default {
  create,
}
