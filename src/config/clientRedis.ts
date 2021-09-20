import dotenv from 'dotenv'
import chalk from 'chalk'
import redis, { ClientOpts } from 'redis'

dotenv.config()

const optConfig: ClientOpts = {
  host: process.env.REDIS_HOST ?? '127.0.0.1',
  port: Number(process.env.REDIS_PORT) ?? 6379,
  password: process.env.REDIS_PASSWORD ?? undefined,
}

const clientRedis = redis.createClient(optConfig)

clientRedis.on('connect', function () {
  const name = chalk.cyan('Redis Client')
  console.log(`${name} Connection has been established successfully.`)
})

clientRedis.on('error', function (err) {
  console.log(`${chalk.red('Redis Error:')} Something went wrong ${err}`)
})

export default clientRedis
