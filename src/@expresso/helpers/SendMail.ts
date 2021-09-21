import { BASE_URL_SERVER } from '@config/baseURL'
import ResponseError from '@expresso/modules/Response/ResponseError'
import EmailProvider from '@expresso/providers/Email'
import dotenv from 'dotenv'
import fs from 'fs'
import Handlebars from 'handlebars'
import path from 'path'
import { readHTMLFile } from './File'

dotenv.config()

interface AccountRegistrationProps {
  email: string
  fullName: string
  token: string
}

const APP_NAME = process.env.APP_NAME ?? 'expresso'

const SMTPEmail = new EmailProvider()

class SendMail {
  /**
   *
   * @param formData
   */
  public static AccountRegistration(formData: AccountRegistrationProps): void {
    const templatePath = path.resolve(
      `${__dirname}/../../../public/templates/emails/register.html`
    )
    console.log({ templatePath })

    const subject = 'Email Verification'
    const tokenUrl = `${BASE_URL_SERVER}/email/verify?token=${formData.token}`
    const templateData = { APP_NAME, tokenUrl, ...formData }

    if (!fs.existsSync(templatePath)) {
      throw new ResponseError.BadRequest(
        'invalid template path for email registration'
      )
    }

    readHTMLFile(templatePath, async (err: Error, html: any) => {
      if (err) console.log(err)

      const template = Handlebars.compile(html)
      const htmlToSend = template(templateData)

      await SMTPEmail.send(formData.email, subject, htmlToSend)
    })
  }
}

export default SendMail
