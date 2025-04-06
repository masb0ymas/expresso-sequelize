import { green } from 'colorette'
import fs from 'fs'
import Handlebars from 'handlebars'
import path from 'path'
import { env } from '~/config/env'
import { logger } from '~/config/logger'
import { smtp } from '~/config/smtp'
import { readHTMLFile } from '~/lib/fs/read-file'
import ErrorResponse from '~/lib/http/errors'
import { currentDir } from '~/lib/string'

/**
 * Returns the path to the email template
 * @param htmlPath - the path to the email template
 * @returns the path to the email template
 */
function _emailTemplatePath(htmlPath: string) {
  const _path = path.resolve(`${currentDir}/public/email-template/${htmlPath}`)

  const msgType = green('email template')
  logger.info(`${msgType} - ${_path} exists`)

  return _path
}

/**
 * Sends an email
 * @param _path - the path to the email template
 * @param data - the data to be sent
 * @returns the email template
 */
async function _sendMail(_path: string, data: any) {
  if (!fs.existsSync(_path)) {
    throw new ErrorResponse.BadRequest('invalid template path ')
  }

  const html = await readHTMLFile(_path)
  const template = Handlebars.compile(html)
  const htmlToSend = template(data)

  await smtp.send({
    to: data.email,
    subject: data.subject,
    text: data.text,
    html: htmlToSend,
  })
}

type SendEmailRegistrationParams = {
  fullname: string
  email: string
  url_token: string
}

/**
 * Sends an email to the user
 * @param values - the data to be sent
 */
export async function SendEmailRegistration(values: SendEmailRegistrationParams) {
  const _path = _emailTemplatePath('register.html')

  const { fullname, url_token } = values
  const subject = `${fullname}, Thank you for registering on the ${env.APP_NAME} App`
  const text = `Please click the link below to verify your email: ${env.APP_URL}/verify/${url_token}`

  const data = { ...values, subject, text, APP_NAME: env.APP_NAME }
  await _sendMail(_path, data)
}
