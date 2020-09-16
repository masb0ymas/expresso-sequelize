import nodemailer from 'nodemailer'
import mg from 'nodemailer-mailgun-transport'
import { google } from 'googleapis'
import { isEmpty } from 'lodash'

require('dotenv').config()

const {
  APP_NAME,
  MAIL_DRIVER,
  MAIL_HOST,
  MAIL_PORT,
  MAIL_USERNAME,
  MAIL_PASSWORD,
  MAIL_AUTH_TYPE,
  MAILGUN_API_KEY,
  MAILGUN_DOMAIN,
  OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET,
  OAUTH_REFRESH_TOKEN,
  OAUTH_REDIRECT_URL,
} = process.env

const isMailgunAPI = !isEmpty(MAILGUN_API_KEY) || !isEmpty(MAILGUN_DOMAIN)

class EmailProvider {
  private mailConfig: nodemailer.SentMessageInfo

  private mailOptions: nodemailer.SendMailOptions | undefined

  public send = (
    to: string[],
    subject: string,
    template: string
  ): void | string[] => {
    const dest: string = Array.isArray(to) ? to.join(',') : to
    const text: string = template
    // send an e-mail
    this.sendMail(dest, subject, text)
  }

  private setMailConfig = (): nodemailer.SentMessageInfo => {
    const configTransport: nodemailer.SentMessageInfo = {
      service: MAIL_DRIVER,
      auth: {
        user: '',
      },
    }

    // Use Google OAuth
    if (MAIL_AUTH_TYPE === 'OAuth2') {
      const oauth2Client = new google.auth.OAuth2(
        OAUTH_CLIENT_ID,
        OAUTH_CLIENT_SECRET,
        OAUTH_REDIRECT_URL
      )

      oauth2Client.setCredentials({
        refresh_token: OAUTH_REFRESH_TOKEN,
      })

      const accessToken = async () => {
        const result = await oauth2Client.getRequestHeaders()
        return result
      }

      configTransport.auth.user = MAIL_USERNAME
      configTransport.auth.type = MAIL_AUTH_TYPE
      configTransport.auth.clientId = OAUTH_CLIENT_ID
      configTransport.auth.clientSecret = OAUTH_CLIENT_SECRET
      configTransport.auth.refreshToken = OAUTH_REFRESH_TOKEN
      configTransport.auth.accessToken = accessToken()
    } else if (isMailgunAPI) {
      // SMPT with Mailgun API
      configTransport.auth.api_key = MAILGUN_API_KEY
      configTransport.auth.domain = MAILGUN_DOMAIN
    } else {
      // SMTP Default
      configTransport.host = MAIL_HOST
      configTransport.port = MAIL_PORT
      configTransport.auth.user = MAIL_USERNAME
      configTransport.auth.pass = MAIL_PASSWORD
    }

    return configTransport
  }

  private setMailOptions = (
    dest: string,
    subject: string,
    text: string
  ): nodemailer.SendMailOptions => {
    return {
      from: `${APP_NAME} <${MAIL_USERNAME}>`,
      to: dest,
      subject,
      html: text,
    }
  }

  private sendMail = (
    dest: string,
    subject: string,
    text: string
  ): void | string[] => {
    this.mailConfig = isMailgunAPI
      ? mg(this.setMailConfig())
      : this.setMailConfig()
    this.mailOptions = this.setMailOptions(dest, subject, text)
    // Nodemailer Transport
    const transporter: nodemailer.Transporter = nodemailer.createTransport(
      this.mailConfig
    )
    transporter.sendMail(
      this.mailOptions,
      // @ts-ignore
      (error: Error, info: nodemailer.SentMessageInfo) => {
        if (error) {
          console.log(error)
        } else {
          console.log('successfully', info)
        }
      }
    )
  }
}

export default EmailProvider
