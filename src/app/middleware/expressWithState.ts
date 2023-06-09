import { type NextFunction, type Request, type Response } from 'express'
import withState from '~/core/modules/withState'

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
