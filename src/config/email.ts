import nodemailer from 'nodemailer'
import { google } from 'googleapis'

require('dotenv').config()

const {
  APP_NAME,
  MAIL_DRIVER,
  MAIL_HOST,
  MAIL_PORT,
  MAIL_USERNAME,
  MAIL_PASSWORD,
  MAIL_AUTH_TYPE,
  OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET,
  OAUTH_REFRESH_TOKEN,
  OAUTH_REDIRECT_URL,
} = process.env

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
        user: MAIL_USERNAME,
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

      configTransport.auth.type = MAIL_AUTH_TYPE
      configTransport.auth.clientId = OAUTH_CLIENT_ID
      configTransport.auth.clientSecret = OAUTH_CLIENT_SECRET
      configTransport.auth.refreshToken = OAUTH_REFRESH_TOKEN
      configTransport.auth.accessToken = accessToken()
    } else {
      // SMTP Default
      configTransport.host = MAIL_HOST
      configTransport.port = MAIL_PORT
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
    this.mailConfig = this.setMailConfig()
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
