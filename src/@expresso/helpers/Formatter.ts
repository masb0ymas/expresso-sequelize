import { LOG_SERVER } from '@config/baseURL'
import { i18nConfig } from '@config/i18nextConfig'
import { ReqOptions } from '@expresso/interfaces/ReqOptions'
import ResponseError from '@expresso/modules/Response/ResponseError'
import chalk from 'chalk'
import { TOptions } from 'i18next'
import _ from 'lodash'
import { validate as uuidValidate } from 'uuid'

/**
 *
 * @param arrayData
 * @returns
 */
function arrayFormatter(arrayData: string | string[]): any[] {
  // check if data not empty
  if (!_.isEmpty(arrayData)) {
    // check if data is array, format: ['1', '2']
    if (Array.isArray(arrayData)) {
      return arrayData
    }

    // format: "['1', '2']"
    const parseJsonArray = JSON.parse(arrayData)
    if (Array.isArray(parseJsonArray)) {
      return parseJsonArray
    }

    return []
  }

  return []
}

/**
 *
 * @param value
 * @returns
 */
function validateEmpty(value: any): any {
  const emptyValues = [null, undefined, '', 'null', 'undefined']

  if (emptyValues.includes(value)) {
    return null
  }

  return value
}

/**
 *
 * @param value
 * @returns
 */
function validateBoolean(value: string | boolean | number | any): boolean {
  const invalidValues = [
    null,
    undefined,
    '',
    false,
    0,
    'false',
    '0',
    'null',
    'undefined',
  ]

  if (invalidValues.includes(value)) {
    return false
  }

  return true
}

/**
 *
 * @param value
 * @param options
 * @returns
 */
function validateUUID(value: string, options?: ReqOptions): string {
  const i18nOpt: string | TOptions = { lng: options?.lang }

  if (!uuidValidate(value)) {
    const message = i18nConfig.t('errors.incorrect_UUID_format', i18nOpt)
    throw new ResponseError.BadRequest(message)
  }

  return value
}

/**
 *
 * @param type
 * @param message
 * @returns
 */
function logServer(type: string, message: string): string {
  const logErr = `${LOG_SERVER} ${chalk.blue(type)} ${chalk.green(message)}`
  return logErr
}

/**
 *
 * @param type
 * @param message
 * @returns
 */
function logErrServer(type: string, message: string): string {
  const logErr = `${LOG_SERVER} ${chalk.red(type)} ${chalk.green(message)}`
  return logErr
}

export {
  arrayFormatter,
  validateEmpty,
  validateBoolean,
  validateUUID,
  logServer,
  logErrServer,
}
