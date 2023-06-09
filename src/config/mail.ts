import { Mail } from 'expresso-provider'
import { type MailDriverType } from 'expresso-provider/lib/mail'
import { env } from './env'

/**
 * Initialize Mail Service Config
 */
export const mailService = new Mail({
  // Your App Name
  appName: env.APP_NAME,

  // Mail Driver support 'smtp' | 'gmail'
  driver: env.MAIL_DRIVER as MailDriverType,

  // Mail Host
  host: env.MAIL_HOST,

  // Mail Port
  port: env.MAIL_PORT,

  // Mail Username
  username: env.MAIL_USERNAME,

  // Mail Password
  password: env.MAIL_PASSWORD,
})
