import Redis, { Redis as RedisClient } from 'ioredis'
import ms from 'ms'

require('dotenv').config()

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env

const timeoutRedis = ms('1d') / 1000
const expiryMode = 'PX' // PX = miliseconds || EX = seconds. full documentation https://redis.io/commands/set

class RedisProvider {
  private client: RedisClient

  constructor() {
    this.client = new Redis({
      host: REDIS_HOST,
      port: Number(REDIS_PORT),
      password: REDIS_PASSWORD || undefined,
    })
  }

  /**
   *
   * @param key
   * @param data
   */
  public async set(key: string, data: any) {
    await this.client.set(key, JSON.stringify(data), expiryMode, timeoutRedis)
  }

  /**
   *
   * @param key
   */
  public async get<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key)

    if (!data) {
      return null
    }

    const parseData = JSON.parse(data) as T
    return parseData
  }

  /**
   *
   * @param key
   */
  public async delete(key: string) {
    await this.client.del(key)
  }

  /**
   *
   * @param prefix
   */
  public async deleteByPrefix(prefix: string) {
    const keys = await this.client.keys(`${prefix}:*`)

    const pipeline = this.client.pipeline()

    keys.forEach((key) => {
      pipeline.del(key)
    })

    await pipeline.exec()
  }
}

export default RedisProvider
