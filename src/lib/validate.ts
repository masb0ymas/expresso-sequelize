import { isValid } from 'date-fns'
import { isNumeric } from './number'
import { validate as uuidValidate } from 'uuid'
import ErrorResponse from './http/errors'

const emptyValues = [null, undefined, '', 'null', 'undefined']
const invalidValues = [...emptyValues, false, 0, 'false', '0']

export class validate {
  public static number(value: any) {
    if (isNumeric(Number(value))) {
      return Number(value)
    }

    return 0
  }

  public static empty(value: any): any {
    if (emptyValues.includes(value)) {
      return null
    }

    return value
  }

  public static boolean(value: any): boolean {
    if (invalidValues.includes(value)) {
      return false
    }

    return true
  }

  public static isDate(value: string | number | Date | null): boolean {
    if (value == null) {
      return false
    }

    const valueDate = value instanceof Date ? value : new Date(value)
    return isValid(valueDate)
  }

  public static uuid(value: string): string {
    if (!uuidValidate(value)) {
      throw new ErrorResponse.BadRequest('Invalid UUID')
    }

    return value
  }
}
