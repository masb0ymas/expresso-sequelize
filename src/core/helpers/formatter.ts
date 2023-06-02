import { type TOptions } from 'i18next'
import { validate as uuidValidate } from 'uuid'
import { i18nConfig } from '~/config/i18n'
import { type ReqOptions } from '~/core/interface/ReqOptions'
import ResponseError from '~/core/modules/response/ResponseError'

/**
 *
 * @param value
 * @returns
 */
export function validateUUID(value: string, options?: ReqOptions): string {
  const i18nOpt: string | TOptions = { lng: options?.lang }

  if (!uuidValidate(value)) {
    const message = i18nConfig.t('errors.incorrect_UUID_format', i18nOpt)
    throw new ResponseError.BadRequest(message)
  }

  return value
}
