import { describe, test, expect } from '@jest/globals'
import { formatHidePhone, formatPhone, formatPhoneWhatsapp } from '../phone'

describe('helpers phone test', () => {
  test('should format phone number', () => {
    const anyValue = '081234567890'
    const expectValue = '+6281234567890'

    const data = formatPhone(anyValue)

    expect(data).toEqual(expectValue)
  })

  test('should format phone number whatsapp', () => {
    const anyValue = '081234567890'
    const expectValue = '6281234567890@c.us'

    const data = formatPhoneWhatsapp(anyValue)

    expect(data).toEqual(expectValue)
  })

  test('should format phone number whatsapp', () => {
    const anyValue = '081234567890'
    const expectValue = '+6281234***890'

    const data = formatHidePhone(anyValue)

    expect(data).toEqual(expectValue)
  })
})
