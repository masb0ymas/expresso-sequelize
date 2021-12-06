import * as yup from 'yup'

const create = yup.object().shape({
  UserId: yup.string().required('user is required'),
  title: yup.string().required('title is required'),
  text: yup.string().required('text is required'),
  html: yup.string().required('html is required'),
  type: yup.string().required('type is required'),
  isRead: yup.boolean().nullable(),
  sendAt: yup.date().nullable(),
  isSend: yup.boolean().nullable(),
})

const notificationSchema = { create }

export default notificationSchema
