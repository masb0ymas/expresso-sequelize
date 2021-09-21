/* eslint-disable @typescript-eslint/no-invalid-void-type */
import clientRedis from '@config/clientRedis'
import chalk from 'chalk'
import dotenv from 'dotenv'
import { NextFunction, Request, Response } from 'express'
import { RateLimiterRedis } from 'rate-limiter-flexible'

dotenv.config()

const RATE_LIMIT = Number(process.env.RATE_LIMIT) || 50

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
    console.log(chalk.red(errType), chalk.green(message))

    return res.status(429).json({ code: 429, message })
  }
}

export default ExpressRateLimit
