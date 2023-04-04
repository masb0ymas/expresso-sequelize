import * as yup from 'yup'

const create = yup
  .object({
    keyFile: yup.string().required('key file is required'),
    filename: yup.string().required('filename is required'),
    mimetype: yup.string().required('mimetype is required'),
    size: yup.number().required('size is required'),
    signedURL: yup.string().required('signed url is required'),
    expiryDateURL: yup.date().required('expiry date url is required'),
  })
  .required()

const uploadSchema = { create }

export default uploadSchema
