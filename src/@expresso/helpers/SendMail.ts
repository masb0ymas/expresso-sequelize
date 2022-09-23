import { BASE_URL_SERVER } from '@config/baseURL'
import ResponseError from '@expresso/modules/Response/ResponseError'
import EmailProvider from '@expresso/providers/Email'
import fs from 'fs'
import Handlebars from 'handlebars'
import path from 'path'
import { readHTMLFile } from './File'
import { APP_NAME } from '@config/env'

interface AccountRegistrationEntity {
  email: string
  fullName: string
  token: string
}

const SMTPEmail = new EmailProvider()

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
   * @param values
   */
  public static AccountRegistration(values: AccountRegistrationEntity): void {
    const templatePath = this.getPath('register.html')

    const { email, token } = values
    const subject = `Email Verification`

    const tokenUrl = `${BASE_URL_SERVER}/v1/email/verify?token=${token}`
    const templateData = { APP_NAME, tokenUrl, ...values }

    if (!fs.existsSync(templatePath)) {
      throw new ResponseError.BadRequest(
        'invalid template path for email registration'
      )
    }

    // read html template email
    readHTMLFile(templatePath, (err: Error, html: any) => {
      if (err) console.log(err)

      const template = Handlebars.compile(html)
      const htmlToSend = template(templateData)

      SMTPEmail.send(email, subject, htmlToSend)
    })
  }
}

export default SendMail
