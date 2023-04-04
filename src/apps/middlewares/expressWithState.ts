import withState from '@core/helpers/withState'
import { type NextFunction, type Request, type Response } from 'express'

/**
 * Express With State
 * @returns
 */
export const expressWithState = () => {
  return function (req: Request, _res: Response, next: NextFunction) {
    new withState(req)

    next()
  }
}
