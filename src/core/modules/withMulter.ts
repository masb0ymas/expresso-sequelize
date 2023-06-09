import { type Request } from 'express'
import _ from 'lodash'

/**
 *
 * @param req
 * @param fields
 * @returns
 */
export function pickSingleFieldMulter(
  req: Request,
  fields: string[]
): Partial<any> {
  return _.pickBy(
    fields.reduce<any>((acc, field) => {
      acc[field] = req.getSingleArrayFile(field)
      return acc
    }, {}),
    (value) => {
      return value !== undefined
    }
  )
}

/**
 *
 * @param req
 * @param fields
 * @returns
 */
export function pickMultiFieldMulter(
  req: Request,
  fields: string[]
): Partial<any> {
  return _.pickBy(
    fields.reduce<any>((acc, field) => {
      acc[field] = req.getMultiArrayFile(field)
      return acc
    }, {}),
    (value) => {
      return value !== undefined
    }
  )
}
