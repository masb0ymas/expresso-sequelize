import { readHTMLFile } from '@expresso/helpers/File'
import ResponseError from '@expresso/modules/Response/ResponseError'
import EmailProvider from '@expresso/providers/Email'
import { BASE_URL_CLIENT } from 'config/baseURL'
import handlebars from 'handlebars'
import { EmailAttributes, UserAttributes } from 'models/user'
import path from 'path'

const { APP_NAME } = process.env

class SendMail {
  /**
   *
   * @param formData
   * @param token
   */
  public static AccountRegister(formData: UserAttributes, token: string) {
    const { email, fullName }: EmailAttributes = formData
    const pathTemplate = path.resolve(
      __dirname,
      `../../../public/templates/emails/register.html`
    )

    const subject = 'Email Verification'
    const urlToken = `${BASE_URL_CLIENT}/email/verify?token=${token}`
    const dataTemplate = { APP_NAME, fullName, urlToken }
    const Email = new EmailProvider()

    readHTMLFile(pathTemplate, (error: Error, html: any) => {
      if (error) {
        throw new ResponseError.NotFound('email template not found')
      }

      const template = handlebars.compile(html)
      const htmlToSend = template(dataTemplate)

      Email.send(email, subject, htmlToSend)
    })
  }
}

export default SendMail
