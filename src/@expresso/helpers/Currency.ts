const locale = 'id-ID'

const formatCurrencyIDR = (value: string | number | any): string => {
  if (value && Number(value)) {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value)
  }
  return '-'
}

const formatCurrency = (value: string | number | any): string => {
  if (value && Number(value)) {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value)
  }
  return '-'
}

const currencyParser = (value: string | number | any): any => {
  try {
    // for when the input gets clears
    if (typeof value === 'string' && !value.length) {
      // eslint-disable-next-line no-param-reassign
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
      // eslint-disable-next-line no-restricted-properties
      reversedVal *= 10 ** (digitsAfterDecimalCount - 2)
    }

    return Number.isNaN(reversedVal) ? 0 : reversedVal
  } catch (error) {
    console.error(error)
  }
}

export { formatCurrencyIDR, formatCurrency, currencyParser }
