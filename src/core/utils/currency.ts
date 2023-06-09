import { currency } from 'expresso-core'

const locale = 'id-ID'

/**
 *
 * @param value
 * @returns
 */
export function formatCurrencyIDR(value: string | number): string {
  const data = currency.format({
    nominal: value,
    options: { locale: 'id-ID', currency: 'IDR' },
  })

  return data
}

/**
 *
 * @param value
 * @returns
 */
export function formatCurrency(value: string | number): string {
  const data = currency.format({ nominal: value })

  return data
}

/**
 *
 * @param value
 * @returns
 */
export function currencyParser(value: string | number | any): any {
  try {
    // for when the input gets clears
    if (typeof value === 'string' && !value.length) {
      value = '0.0'
    }

    // detecting and parsing between comma and dot
    const group = new Intl.NumberFormat(locale).format(1111).replace(/1/g, '')
    const decimal = new Intl.NumberFormat(locale).format(1.1).replace(/1/g, '')
    let reversedVal = value.replace(new RegExp(`\\${group}`, 'g'), '')
    reversedVal = reversedVal.replace(new RegExp(`\\${decimal}`, 'g'), '.')
    //  => 1232.21 €

    // removing everything except the digits and dot
    reversedVal = reversedVal.replace(/[^0-9.]/g, '')
    //  => 1232.21

    // appending digits properly
    const digitsAfterDecimalCount = (reversedVal.split('.')[1] || []).length
    const needsDigitsAppended = digitsAfterDecimalCount > 2

    if (needsDigitsAppended) {
      reversedVal *= 10 ** (digitsAfterDecimalCount - 2)
    }

    return Number.isNaN(reversedVal) ? 0 : reversedVal
  } catch (error) {
    console.error(error)
  }
}
