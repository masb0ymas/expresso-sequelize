import { green } from 'colorette'
import { readHTMLFile } from 'expresso-core'
import fs from 'fs'
import Handlebars from 'handlebars'
import path from 'path'
import { env } from '~/config/env'
import { mailService } from '~/config/mail'
import { logger } from '~/config/pino'
import { type TMailRegistrationEntity } from '../interface/SendMail'
import ResponseError from '../modules/response/ResponseError'

class SendMail {
  /**
   * Get Template Path
   * @param htmlPath
   * @returns
   */
  private static _getPath(htmlPath: string): string {
    const templatePath = path.resolve(
      `${process.cwd()}/public/templates/emails/${htmlPath}`
    )

    const msgType = green('email template')
    logger.info(`${msgType} - ${templatePath} exists`)

    return templatePath
  }

  /**
   * Send Template Mail
   * @param _path
   * @param mailTo
   * @param subject
   * @param data
   */
  private static async _sendTemplateMail(
    _path: string,
    mailTo: string,
    subject: string,
    data: string | any
  ): Promise<void> {
    if (!fs.existsSync(_path)) {
      throw new ResponseError.BadRequest('invalid template path ')
    }

    const html = await readHTMLFile(_path)

    const template = Handlebars.compile(html)
    const htmlToSend = template(data)

    mailService.send(mailTo, subject, htmlToSend)
  }

  /**
   * Send Mail with Account Registration Template
   * @param values
   */
  public static async accountRegistration(
    values: TMailRegistrationEntity
  ): Promise<void> {
    const _path = this._getPath('register.html')

    const { fullname, email } = values
    const subject = `${fullname}, Thank you for registering on the ${env.APP_NAME} App`

    const data = { ...values }
    await this._sendTemplateMail(_path, email, subject, data)
  }
}

export default SendMail
