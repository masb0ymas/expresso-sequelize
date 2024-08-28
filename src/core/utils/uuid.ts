import { TOptions } from 'i18next'
import { validate as uuidValidate } from 'uuid'
import { i18n } from '~/config/i18n'
import { IReqOptions } from '../interface/ReqOptions'
import ErrorResponse from '../modules/response/ErrorResponse'

/**
 *
 * @param value
 * @returns
 */
export function validateUUID(value: string, options?: IReqOptions): string {
  const i18nOpt: string | TOptions = { lng: options?.lang }

  if (!uuidValidate(value)) {
    const message = i18n.t('errors.incorrect_uuid_format', i18nOpt)
    throw new ErrorResponse.BadRequest(message)
  }

  return value
}
