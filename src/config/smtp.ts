import Nodemailer from '~/lib/smtp/nodemailer'
import { env } from './env'

export const smtp = new Nodemailer({
  transporter: {
    host: env.MAIL_HOST,
    port: env.MAIL_PORT,
    secure: env.MAIL_ENCRYPTION === 'ssl',
    auth: {
      user: env.MAIL_USERNAME,
      pass: env.MAIL_PASSWORD,
    },
  },
  defaults: {
    from: env.MAIL_FROM,
  },
})
