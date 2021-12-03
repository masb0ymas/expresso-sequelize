import { logErrServer, logServer } from '@expresso/helpers/Formatter'
import dotenv from 'dotenv'
import redis, { ClientOpts } from 'redis'

dotenv.config()

const optConfig: ClientOpts = {
  host: process.env.REDIS_HOST ?? '127.0.0.1',
  port: Number(process.env.REDIS_PORT) ?? 6379,
  password: process.env.REDIS_PASSWORD ?? undefined,
}

const clientRedis = redis.createClient(optConfig)

// client connect
clientRedis.on('connect', function () {
  const msgType = `Redis`
  const message = `Connection has been established successfully.`

  console.log(logServer(msgType, message))
})

// client error
clientRedis.on('error', function (err) {
  const errType = `Redis Error:`
  const message = `Something went wrong ${err}`

  console.log(logErrServer(errType, message))
})

export default clientRedis
