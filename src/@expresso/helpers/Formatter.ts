import ResponseError from '@expresso/modules/Response/ResponseError'
import _ from 'lodash'
import { validate as uuidValidate } from 'uuid'

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
 * @param arrayData
 * @returns
 */
function arrayFormatter(arrayData: string | string[]): any[] {
  // check if data not empty
  if (!_.isEmpty(arrayData)) {
    // check if data is array, format: ['1', '2']
    if (Array.isArray(arrayData)) {
      return arrayData
    }

    // format: "['1', '2']"
    const parseJsonArray = JSON.parse(arrayData)
    if (Array.isArray(parseJsonArray)) {
      return parseJsonArray
    }

    return []
  }

  return []
}

/**
 *
 * @param value
 * @returns
 */
function validateEmpty(value: any): any {
  const emptyValues = [null, undefined, '', 'null', 'undefined']

  if (emptyValues.includes(value)) {
    return null
  }

  return value
}

function validateBoolean(value: string | boolean | number | any): boolean {
  if (invalidValues.includes(value)) {
    return false
  }

  return true
}

/**
 *
 * @param value
 * @returns
 */
function validateUUID(value: string): string {
  if (!uuidValidate(value)) {
    throw new ResponseError.BadRequest('incorrect uuid format')
  }

  return value
}

export { arrayFormatter, validateEmpty, validateBoolean, validateUUID }
