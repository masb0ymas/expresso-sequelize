import * as yup from 'yup'

const create = yup.object().shape({
  name: yup.string().required('name is required'),
})

const hobbySchema = { create }

export default hobbySchema
