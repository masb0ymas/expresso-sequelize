import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from '@config/env'
import Redis, { Redis as RedisClient } from 'ioredis'
import ms from 'ms'

const defaultTimeout = ms('1d') / 1000
const defaultExpiry = 'PX' // PX = miliseconds || EX = seconds. full documentation https://redis.io/commands/set

interface RedisOptionsProps {
  expiryMode?: string | any[]
  timeout?: string | number
}

class RedisProvider {
  private readonly client: RedisClient

  constructor() {
    this.client = new Redis({
      host: REDIS_HOST,
      port: REDIS_PORT,
      password: REDIS_PASSWORD,
    })
  }

  /**
   *
   * @param key
   * @param data
   * @param options
   */
  public async set(
    key: string,
    data: any,
    options?: RedisOptionsProps
  ): Promise<void> {
    const expiryMode = options?.expiryMode ?? defaultExpiry
    const timeoutRedis = options?.timeout ?? defaultTimeout

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
