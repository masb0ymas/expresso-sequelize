import dotenv from 'dotenv'
import Redis, { Redis as RedisClient } from 'ioredis'
import ms from 'ms'

dotenv.config()

const timeoutRedis = ms('1d') / 1000
const expiryMode = 'PX' // PX = miliseconds || EX = seconds. full documentation https://redis.io/commands/set

class RedisProvider {
  private readonly client: RedisClient

  constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST ?? '127.0.0.1',
      port: Number(process.env.REDIS_PORT) ?? 6379,
      password: process.env.REDIS_PASSWORD ?? undefined,
    })
  }

  /**
   *
   * @param key
   * @param data
   */
  public async set(key: string, data: any): Promise<void> {
    await this.client.set(key, JSON.stringify(data), expiryMode, timeoutRedis)
  }

  /**
   *
   * @param key
   * @returns
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
  public async delete(key: string): Promise<void> {
    await this.client.del(key)
  }

  /**
   *
   * @param prefix
   */
  public async deleteByPrefix(prefix: string): Promise<void> {
    const keys = await this.client.keys(`${prefix}:*`)

    const pipeline = this.client.pipeline()

    keys.forEach((key) => {
      pipeline.del(key)
    })

    await pipeline.exec()
  }
}

export default RedisProvider
