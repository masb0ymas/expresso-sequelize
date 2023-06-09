import { describe, test, expect } from '@jest/globals'
import { currencyParser, formatCurrency, formatCurrencyIDR } from '../currency'

describe('helpers currency test', () => {
  test('should format currency IDR', () => {
    const anyValue = '125000'
    const expectValue = 'Rp 125.000'

    const data = formatCurrencyIDR(anyValue)

    expect(data).toEqual(expectValue)
  })

  test('should format currency', () => {
    const anyValue = '125000'
    const expectValue = '125.000'

    const data = formatCurrency(anyValue)

    expect(data).toEqual(expectValue)
  })

  test('should format currency parser', () => {
    const anyValue = '1232.21 €'
    const expectValue = '123221'

    const data = currencyParser(anyValue)

    expect(data).toEqual(expectValue)
  })
})
