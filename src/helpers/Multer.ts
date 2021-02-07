import { pickBy } from 'lodash'
import { Request } from 'express'

/**
 *
 * @param req
 * @param fields
 */
function pickSingleFieldMulter(req: Request, fields: string[]) {
  return pickBy(
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
 */
function pickMultiFieldMulter(req: Request, fields: string[]) {
  return pickBy(
    fields.reduce<any>((acc, field) => {
      acc[field] = req.getMultiArrayFile(field)
      return acc
    }, {}),
    (value) => {
      return value !== undefined
    }
  )
}

const Multers = {
  pickSingleFieldMulter,
  pickMultiFieldMulter,
}

export default Multers
