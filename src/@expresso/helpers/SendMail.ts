import { APP_NAME } from '@config/env'
import { AccountRegistrationEntity } from '@expresso/interfaces/SendMail'
import ResponseError from '@expresso/modules/Response/ResponseError'
import EmailProvider from '@expresso/providers/Email'
import fs from 'fs'
import Handlebars from 'handlebars'
import path from 'path'
import { readHTMLFile } from './File'

const MailProvider = new EmailProvider()

class SendMail {
  /**
   *
   * @param html
   * @returns
   */
  private static getPath(html: string): string {
    const templatePath = path.resolve(
      `${__dirname}/../../../public/templates/emails/${html}`
    )
    console.log({ templatePath })

    return templatePath
  }

  /**
   *
   * @param _path
   * @param mailTo
   * @param subject
   * @param data
   */
  private static sendTemplateMail(
    _path: string,
    mailTo: string,
    subject: string,
    data: string | any
  ): void {
    if (!fs.existsSync(_path)) {
      throw new ResponseError.BadRequest('invalid template path ')
    }

    readHTMLFile(_path, (err: Error, html: any) => {
      if (err) console.log(err)

      const template = Handlebars.compile(html)
      const htmlToSend = template(data)

      MailProvider.send(mailTo, subject, htmlToSend)
    })
  }

  /**
   *
   * @param values
   */
  public static AccountRegistration(values: AccountRegistrationEntity): void {
    const _path = this.getPath('register.html')

    const { fullname, email } = values
    const subject = `${fullname}, Terima kasih telah mendaftar di App ${APP_NAME}`

    const data = { ...values }

    this.sendTemplateMail(_path, email, subject, data)
  }
}

export default SendMail
