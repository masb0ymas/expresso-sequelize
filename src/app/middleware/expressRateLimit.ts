import { type NextFunction, type Request, type Response } from 'express'
import {
  rateLimit,
  type Options,
  type RateLimitRequestHandler,
} from 'express-rate-limit'
import { ms } from 'expresso-core'
import { env } from '~/config/env'
import HttpResponse from '~/core/modules/response/HttpResponse'

/**
 * Express Rate Limit
 * @returns
 */
export const expressRateLimit = (): RateLimitRequestHandler => {
  const delay = ms(env.RATE_DELAY)

  return rateLimit({
    windowMs: delay, // 15 minutes
    max: env.RATE_LIMIT, // Limit each IP to 100 requests per `window`
    handler: (
      _req: Request,
      res: Response,
      _next: NextFunction,
      options: Options
    ) => {
      const httpResponse = HttpResponse.get({
        code: options.statusCode,
        message: options.message,
      })

      res.status(options.statusCode).json(httpResponse)
    },
  })
}
