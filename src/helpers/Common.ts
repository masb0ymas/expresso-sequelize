import { isEmpty } from 'lodash'

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
    // check if data is array, format: ['1', '2']
    if (Array.isArray(arrayData)) {
      return arrayData
    }

    // format: "['1', '2']"
    return JSON.parse(arrayData)
  }

  return []
}

/**
 *
 * @param value
 */
function validateEmpty(value: any) {
  const emptyValues = [null, undefined, '', 'null', 'undefined']

  if (emptyValues.includes(value)) {
    return null
  }

  return value
}

/**
 *
 * @param value
 */
function validateBoolean(value: string | boolean | Number | any) {
  if (invalidValues.includes(value)) {
    return false
  }

  return true
}

export {
  getUniqueCodev2,
  invalidValues,
  arrayFormatter,
  validateEmpty,
  validateBoolean,
}
