import { Mail } from 'expresso-provider'
import { type MailDriverType } from 'expresso-provider/lib/mail'
import {
  APP_NAME,
  MAIL_DRIVER,
  MAIL_HOST,
  MAIL_PASSWORD,
  MAIL_PORT,
  MAIL_USERNAME,
} from './env'

const mailDriver = MAIL_DRIVER as MailDriverType

export const mailService = new Mail({
  appName: APP_NAME,
  driver: mailDriver,
  host: MAIL_HOST,
  port: MAIL_PORT,
  username: String(MAIL_USERNAME),
  password: MAIL_PASSWORD,
})
