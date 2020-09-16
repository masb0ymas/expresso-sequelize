import redis from 'redis'

const client = redis.createClient()

client.on('connect', function () {
  console.log('Redis client connected')
})

client.on('error', function (err) {
  console.log(`Something went wrong ${err}`)
})

class Redis {
  public static set(key: string, data: any[]) {
    client.setex(key, 86400, JSON.stringify(data))
  }

  public static get(key: string) {
    client.get(key)
  }

  public static del(key: string) {
    client.del(key)
  }
}

export default Redis
