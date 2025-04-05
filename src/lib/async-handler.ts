import { NextFunction, Request, Response } from 'express'
import expressAsyncHandler from 'express-async-handler'

/**
 * A higher-order function that wraps a given async function
 * with error handling support, so that any rejected promises
 * are caught and passed to express's built-in error handler.
 *
 * @param {function} fn - The async function to wrap.
 * @returns {function} - The wrapped async function.
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      await fn(req, res, next)
      return
    }
  )
}
