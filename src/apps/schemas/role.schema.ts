import * as yup from 'yup'

const create = yup
  .object({
    name: yup.string().required('name is required'),
  })
  .required()

const roleSchema = { create }

export default roleSchema
