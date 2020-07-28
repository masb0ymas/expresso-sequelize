import redis from 'redis'

const client = redis.createClient()

client.on('connect', function () {
  console.log('Redis client connected')
})

client.on('error', function (err) {
  console.log(`Something went wrong ${err}`)
})

export function redisCache(key: string, data: any[]): void {
  client.setex(key, 86400, JSON.stringify(data))
}

export function redisDeleteCache(key: string) {
  client.del(key)
}

export default client
