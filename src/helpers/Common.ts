import { isEmpty } from 'lodash'

const invalidValues = [null, undefined, '', false, 0]

/**
 *
 * @param length - Generate Unique Code ( default length 32 )
 */
function getUniqueCodev2(length = 32) {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

/**
 *
 * @param arrayData
 */
function arrayFormatter(arrayData: string | string[]) {
  // check if data not empty
  if (!isEmpty(arrayData)) {
    // check if data is array
    if (Array.isArray(arrayData)) {
      return arrayData
    }
    return JSON.parse(arrayData)
  }

  return []
}

/**
 *
 * @param value
 */
function validateEmpty(value: any) {
  const emptyValues = [undefined, 'undefined', null, 'null', '']

  if (isEmpty(value) || emptyValues.includes(value)) {
    return null
  }

  return value
}

/**
 *
 * @param value
 */
function validateBoolean(value: string | boolean | Number) {
  if (value === 'true' || value === 1 || value === '1' || value === true) {
    return true
  }

  if (value === 'false' || value === 0 || value === '0' || value === false) {
    return false
  }

  return null
}

export {
  getUniqueCodev2,
  invalidValues,
  arrayFormatter,
  validateEmpty,
  validateBoolean,
}
