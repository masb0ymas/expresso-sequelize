import redis, { ClientOpts } from 'redis'

require('dotenv').config()

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env

const optionConfigs: ClientOpts = {
  host: REDIS_HOST,
  port: Number(REDIS_PORT),
  password: REDIS_PASSWORD || undefined,
}

export const redisClient = redis.createClient(optionConfigs)

redisClient.on('connect', function () {
  console.log('Redis client connected')
})

redisClient.on('error', function (err) {
  console.log(`Something went wrong ${err}`)
})

const timeoutSetRedis = 86400

class Redis {
  /**
   *
   * @param key
   * @param data
   */
  public static set(key: string, data: any[]) {
    redisClient.setex(key, timeoutSetRedis, JSON.stringify(data))
  }

  /**
   *
   * @param key
   * @example
   * // get('get-role')
   */
  public static get(key: string) {
    redisClient.get(key)
  }

  /**
   *
   * @param key get all by key return array
   * @example
   * // keys.('get-role:*')
   */
  public static keys(key: string) {
    redisClient.keys(key)
  }

  /**
   *
   * @param key
   */
  public static del(key: string) {
    redisClient.del(key)
  }
}

export default Redis
