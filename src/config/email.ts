import nodemailer from 'nodemailer'

require('dotenv').config()

const {
  APP_NAME,
  MAIL_DRIVER,
  MAIL_HOST,
  MAIL_PORT,
  MAIL_USERNAME,
  MAIL_PASSWORD,
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
      host: MAIL_HOST,
      port: MAIL_PORT,
      auth: {
        user: MAIL_USERNAME,
        pass: MAIL_PASSWORD,
      },
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
