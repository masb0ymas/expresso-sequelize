import { Redis } from 'expresso-provider'
import { env } from './env'

/**
 * Initialize Redis Service Config
 */
export const redisService = new Redis({
  // Redis Host
  host: env.REDIS_HOST,

  // Redis Port
  port: env.REDIS_PORT,

  // Redis Password
  password: env.REDIS_PASSWORD,
})
