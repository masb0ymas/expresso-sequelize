import dotenv from 'dotenv'
import chalk from 'chalk'
import redis, { ClientOpts } from 'redis'
import { LOG_SERVER } from './baseURL'

dotenv.config()

const optConfig: ClientOpts = {
  host: process.env.REDIS_HOST ?? '127.0.0.1',
  port: Number(process.env.REDIS_PORT) ?? 6379,
  password: process.env.REDIS_PASSWORD ?? undefined,
}

const clientRedis = redis.createClient(optConfig)

// client connect
clientRedis.on('connect', function () {
  const name = chalk.cyan('Redis Client')
  console.log(
    `${LOG_SERVER} ${name} Connection has been established successfully.`
  )
})

// client error
clientRedis.on('error', function (err) {
  console.log(
    `${LOG_SERVER} ${chalk.red('Redis Error:')} Something went wrong ${err}`
  )
})

export default clientRedis
