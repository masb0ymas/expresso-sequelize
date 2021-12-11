import { logErrServer, logServer } from '@expresso/helpers/Formatter'
import redis, { ClientOpts } from 'redis'
import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from './env'

const optConfig: ClientOpts = {
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD,
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
