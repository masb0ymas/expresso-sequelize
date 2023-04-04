import { type E164Number, parsePhoneNumber } from 'libphonenumber-js'

const locale = 'ID'

/**
 *
 * @param value
 * @returns
 */
export function formatPhone(value: string): E164Number {
  let transformPhone = ''

  if (value.startsWith('+62')) {
    transformPhone = value.replace('+62', '0')
  } else if (value.startsWith('62')) {
    transformPhone = value.replace('62', '0')
  } else if (value.startsWith('08')) {
    transformPhone = value
  } else {
    throw new Error('incorrect Indonesian phone number format')
  }

  const parsePhone = parsePhoneNumber(transformPhone, locale)
  const result = parsePhone.number

  return result
}

/**
 *
 * @param value
 * @returns
 */
export function formatPhoneWhatsapp(value: string): string {
  const phone = formatPhone(value)

  let formatted = ''

  if (!phone.endsWith('@c.us')) {
    formatted = `${phone}@c.us`
  }

  const result = formatted.replace('+', '')

  return result
}

/**
 *
 * @param value
 * @returns
 */
export function formatHidePhone(value: string): string {
  const phone = formatPhone(value)

  const splitPhone = phone.split('+62') // ['+62', '81234567890']
  const newPhone = splitPhone[1] // 81234567890

  const phoneLength = splitPhone[1].length
  const hideLength = phoneLength - 6

  const startPhone = newPhone.slice(0, hideLength)
  const endPhone = newPhone.slice(hideLength + 3)

  const result = `+62${startPhone}***${endPhone}` // '+6281234***890'
  return result
}
