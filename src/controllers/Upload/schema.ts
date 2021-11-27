import * as yup from 'yup'

const create = yup.object().shape({
  keyFile: yup.string().required('key file is required'),
  filename: yup.string().required('filename is required'),
  mimetype: yup.string().required('mimetype is required'),
  size: yup.number().required('size is required'),
  signedUrl: yup.string().required('signed url is required'),
  expiryDateUrl: yup.date().required('expiry date url is required'),
})

const uploadSchema = { create }

export default uploadSchema
