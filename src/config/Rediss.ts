import { isEmpty } from 'lodash'
import redis, { ClientOpts } from 'redis'

require('dotenv').config()

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env

const optionConfigs: ClientOpts = {
  host: REDIS_HOST,
  port: Number(REDIS_PORT),
}

if (!isEmpty(REDIS_PASSWORD)) {
  optionConfigs.password = REDIS_PASSWORD
}

const client = redis.createClient(optionConfigs)

client.on('connect', function () {
  console.log('Redis client connected')
})

client.on('error', function (err) {
  console.log(`Something went wrong ${err}`)
})

class Redis {
  /**
   *
   * @param key
   * @param data
   */
  public static set(key: string, data: any[]) {
    client.setex(key, 86400, JSON.stringify(data))
  }

  /**
   *
   * @param key
   * @example
   * // get('get-role')
   */
  public static get(key: string) {
    client.get(key)
  }

  /**
   *
   * @param key get all by key return array
   * @example
   * // keys.('get-role:*')
   */
  public static keys(key: string) {
    client.keys(key)
  }

  /**
   *
   * @param key
   */
  public static del(key: string) {
    client.del(key)
  }
}

export default Redis
