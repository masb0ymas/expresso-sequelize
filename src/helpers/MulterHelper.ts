/* eslint-disable no-unused-vars */
import { pickBy } from 'lodash'
import { Request } from 'express'

function pickSingelFieldMulter(req: Request, fields: string[]) {
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

const Multers = {
  pickSingelFieldMulter,
}

export default Multers
