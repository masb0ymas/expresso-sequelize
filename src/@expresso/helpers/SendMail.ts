import { BASE_URL_SERVER } from '@config/baseURL'
import { APP_NAME } from '@config/env'
import { i18nConfig } from '@config/i18nextConfig'
import ResponseError from '@expresso/modules/Response/ResponseError'
import EmailProvider from '@expresso/providers/Email'
import fs from 'fs'
import Handlebars from 'handlebars'
import { TOptions } from 'i18next'
import path from 'path'
import { readHTMLFile } from './File'

interface AccountRegistrationProps {
  email: string
  fullName: string
  token: string
}

const SMTPEmail = new EmailProvider()

class SendMail {
  /**
   *
   * @param formData
   * @param lang
   */
  public static AccountRegistration(
    formData: AccountRegistrationProps,
    lang?: string
  ): void {
    const i18nOpt: string | TOptions = { lng: lang }

    const templatePath = path.resolve(
      `${__dirname}/../../../public/templates/emails/register.html`
    )
    console.log({ templatePath })

    const subject = 'Email Verification'
    const tokenUrl = `${BASE_URL_SERVER}/v1/email/verify?token=${formData.token}`
    const templateData = { APP_NAME, tokenUrl, ...formData }

    if (!fs.existsSync(templatePath)) {
      const message = i18nConfig.t('errors.mailTemplate', i18nOpt)
      throw new ResponseError.BadRequest(message)
    }

    // read html template email
    readHTMLFile(templatePath, (err: Error, html: any) => {
      if (err) console.log(err)

      const template = Handlebars.compile(html)
      const htmlToSend = template(templateData)

      SMTPEmail.send(formData.email, subject, htmlToSend)
    })
  }
}

export default SendMail
