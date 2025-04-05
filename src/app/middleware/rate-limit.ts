import { NextFunction, Request, Response } from 'express'
import rateLimit, { Options, RateLimitRequestHandler } from 'express-rate-limit'

export default function expressRateLimit(): RateLimitRequestHandler {
  return rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests
    handler: (_req: Request, res: Response, _next: NextFunction, options: Options) => {
      const result = {
        statusCode: options.statusCode,
        error: 'Too Many Requests',
        message: options.message,
      }

      res.status(options.statusCode).json(result)
    },
  })
}
