import path from 'path'
import handlebars from 'handlebars'
import { readHTMLFile } from 'helpers/Common'
import EmailProvider from 'config/email'
import ResponseError from 'modules/Response/ResponseError'
import { BASE_URL_CLIENT } from 'config/baseClient'
import { EmailAttributes, UserAttributes } from 'models/user'

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
      `../../public/templates/emails/register.html`
    )
    const subject = 'Verifikasi Email'
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
