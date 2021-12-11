/* eslint-disable @typescript-eslint/no-invalid-void-type */
import clientRedis from '@config/clientRedis'
import { RATE_LIMIT } from '@config/env'
import { logErrServer } from '@expresso/helpers/Formatter'
import { NextFunction, Request, Response } from 'express'
import { RateLimiterRedis } from 'rate-limiter-flexible'

// Rate Limit Request
const rateLimiter = new RateLimiterRedis({
  storeClient: clientRedis,
  keyPrefix: 'middleware',
  points: RATE_LIMIT, // 10 requests
  duration: 1, // per 1 second by IP
})

async function ExpressRateLimit(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response<any, Record<string, any>>> {
  try {
    await rateLimiter.consume(req.ip)
    return next()
  } catch (err) {
    const errType = `Limit Request Error:`
    const message = 'Too Many Requests'

    console.log(logErrServer(errType, message))

    return res.status(429).json({ code: 429, message })
  }
}

export default ExpressRateLimit
