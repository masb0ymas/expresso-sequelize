import ResponseError from '@expresso/modules/Response/ResponseError'
import {
  CountryCode,
  E164Number,
  parsePhoneNumber,
  parsePhoneNumberFromString,
} from 'libphonenumber-js'

/**
 *
 * @param phone {string}
 * @returns {E164Number | undefined}
 */
export function formatPhone(phone: string): E164Number | undefined {
  let transformPhone = ''

  // indonesian phone format
  if (phone.startsWith('+62')) {
    transformPhone = phone.replace('+62', '0')
  } else if (phone.startsWith('62')) {
    transformPhone = phone.replace('62', '0')
  } else if (phone.startsWith('08')) {
    transformPhone = phone
  } else {
    throw new ResponseError.BadRequest(
      'Incorrect Indonesian phone number format'
    )
  }

  const parsePhone = parsePhoneNumberFromString(transformPhone, 'ID')
  const newPhone = parsePhone?.number

  return newPhone
}

/**
 *
 * @param phone {string}
 * @returns {string}
 */
export function formatPhoneWhatsApp(phone: string): string {
  const newPhone = formatPhone(phone)

  let formatted = ''

  if (!newPhone?.endsWith('@c.us')) {
    formatted = `${newPhone}@c.us`
  }

  const result = formatted.replace('+', '')

  return result
}

/**
 *
 * @param phone
 * @returns
 */
export function formatHidePhone(
  phone: string,
  options?: { country?: CountryCode }
): string {
  const defaultCountry = options?.country ?? 'ID'

  const newPhone = parsePhoneNumber(phone, defaultCountry) // +621234567890
  const phoneNumber = newPhone.nationalNumber // '81234567890'
  const countryCode = newPhone.countryCallingCode // 62

  const lengthPhone = phoneNumber.length
  const hideLength = lengthPhone - 6

  const startPhone = phoneNumber.slice(0, hideLength) // '81234'
  const endPhone = phoneNumber.slice(hideLength + 3) // '890'

  const resultPhone = `+${countryCode}${startPhone}***${endPhone}` // '+6281234***890'

  return resultPhone
}
