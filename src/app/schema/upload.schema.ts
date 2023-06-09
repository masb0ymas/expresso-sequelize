import * as yup from 'yup'

const create = yup
  .object({
    key_file: yup.string().required('key file is required'),
    filename: yup.string().required('filename is required'),
    mimetype: yup.string().required('mimetype is required'),
    size: yup.number().required('size is required'),
    signed_url: yup.string().required('signed url is required'),
    expiry_date_url: yup.date().required('expiry date url is required'),
  })
  .required()

const uploadSchema = { create }

export default uploadSchema
