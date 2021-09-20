/* eslint-disable @typescript-eslint/no-invalid-void-type */
import ResponseError from '@expresso/modules/Response/ResponseError'
import chalk from 'chalk'
import dotenv from 'dotenv'
import { Headers } from 'gaxios'
import { google } from 'googleapis'
import { isEmpty } from 'lodash'
import nodemailer from 'nodemailer'
import mg from 'nodemailer-mailgun-transport'

dotenv.config()

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
  private mailOptions: nodemailer.SendMailOptions

  /**
   * Send
   * @param to
   * @param subject
   * @param template
   */
  public send = async (
    to: string | string[],
    subject: string,
    template: string
  ): Promise<void | string[]> => {
    const dest: string = Array.isArray(to) ? to.join(',') : to
    const text: string = template

    // send an e-mail
    await this.sendMail(dest, subject, text)
  }

  /**
   * Set Mail Config
   * @returns
   */
  private readonly setMailConfig = (): nodemailer.SentMessageInfo => {
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

      const accessToken = async (): Promise<Headers> => {
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

  /**
   * Set Mail Options
   * @param dest
   * @param subject
   * @param text
   * @returns
   */
  private readonly setMailOptions = (
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

  /**
   * Send Mail
   * @param dest
   * @param subject
   * @param text
   */
  private readonly sendMail = async (
    dest: string,
    subject: string,
    text: string
  ): Promise<void | string[]> => {
    this.mailConfig = isMailgunAPI
      ? mg(this.setMailConfig())
      : this.setMailConfig()

    this.mailOptions = this.setMailOptions(dest, subject, text)

    // Nodemailer Transport
    const transporter = nodemailer.createTransport(this.mailConfig)

    transporter.sendMail(this.mailOptions, (err, info) => {
      if (err) {
        const errMessage = `${chalk.red(
          'Nodemailer Error:'
        )} Something went wrong!, ${err.message}`
        console.log(errMessage)
        throw new ResponseError.BadRequest(errMessage)
      }

      const sending = chalk.cyan('email has been sent')
      console.log(`Success, ${sending}`, info)
    })
  }
}

export default EmailProvider
