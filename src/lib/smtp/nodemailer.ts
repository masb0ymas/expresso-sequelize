import { green } from 'colorette'
import nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import { logger } from '~/config/logger'
import { NodemailerParams } from './types'

export default class Nodemailer {
  private _transporter: SMTPTransport | SMTPTransport.Options
  private _default: SMTPTransport.Options | undefined

  constructor({ transporter, defaults }: NodemailerParams) {
    this._transporter = transporter
    this._default = defaults
  }

  /**
   * Creates a nodemailer client
   * @returns nodemailer client
   */
  private _client() {
    return nodemailer.createTransport(this._transporter, this._default)
  }

  /**
   * Initializes the nodemailer client
   * @returns nodemailer client
   */
  async initialize() {
    const transporter = this._client()
    const msgType = `${green('nodemailer')}`

    try {
      const isValid = await transporter.verify()
      if (!isValid) {
        logger.error(`${msgType} failed to initialize Nodemailer`)
        process.exit(1)
      }

      logger.info(`${msgType} initialized successfully`)
      return transporter
    } catch (error: any) {
      logger.error(`${msgType} failed to initialize: ${error?.message ?? error}`)
      process.exit(1)
    }
  }

  /**
   * Sends an email
   * @param options - options for sending an email
   * @returns email info
   */
  async send(options: nodemailer.SendMailOptions) {
    const transporter = this._client()
    const msgType = `${green('nodemailer')}`

    try {
      const info = await transporter.sendMail(options)
      logger.info(`${msgType} mail sent successfully: ${info.messageId}`)
      return info
    } catch (error: any) {
      logger.error(`${msgType} failed to send mail: ${error?.message ?? error}`)
      throw error
    }
  }
}
