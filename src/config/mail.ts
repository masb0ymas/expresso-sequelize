import { SMTP } from 'expresso-provider'
import { env } from './env'

/**
 * Initialize Mail Service Config
 */
export const mailService = new SMTP(
  { from: `${env.APP_NAME} <${env.MAIL_USERNAME}>` },
  {
    service: env.MAIL_DRIVER,
    host: env.MAIL_HOST,
    port: env.MAIL_PORT,
    auth: {
      user: env.MAIL_USERNAME,
      pass: env.MAIL_PASSWORD,
    },
  }
)
