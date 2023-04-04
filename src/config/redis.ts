import { Redis } from 'expresso-provider'
import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from './env'

export const redisService = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD,
})
