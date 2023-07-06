import { blue, green } from 'colorette'
import { randomUUID } from 'node:crypto'
import { pino } from 'pino'
import PinoHttp, { type HttpLogger } from 'pino-http'
import { formatDate } from '~/core/utils/date'
import { env } from './env'

export const logger = pino(
  {
    level: env.NODE_ENV === 'production' ? 'info' : 'debug',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  },
  pino.destination(`./logs/pino-${formatDate(new Date())}.log`)
)

/**
 * Http Logger
 * @returns
 */
export function httpLogger(): HttpLogger {
  return PinoHttp({
    logger,

    // Define a custom request id function
    genReqId: function (req, res) {
      const existingID = req.id ?? req.headers['x-request-id']
      if (existingID) return existingID

      const id = randomUUID()
      res.setHeader('X-Request-Id', id)
      return id
    },

    // Define a custom logger level
    customLogLevel: function (req, res, err) {
      if (res.statusCode >= 400 && res.statusCode < 500) {
        return 'warn'
      } else if (res.statusCode >= 500 || err) {
        return 'error'
      } else if (res.statusCode >= 300 && res.statusCode < 400) {
        return 'silent'
      }
      return 'info'
    },

    // Define a custom serialize logger
    serializers: {
      req: (req) => ({
        id: req.id,
        method: req.method,
        url: req.url,
        query: req.query,
        params: req.params,
        headers: req.headers,
        body: req.body || req.raw.body,
      }),
      res: (res) => ({
        statusCode: res.statusCode,
        message: res.message,
        data: res.data,
        'x-request-id': res.headers['x-request-id'],
        'x-ratelimit-limit': res.headers['x-ratelimit-limit'],
        'x-ratelimit-remaining': res.headers['x-ratelimit-remaining'],
      }),
    },

    // Define a custom receive message
    customReceivedMessage: function (req, res) {
      // @ts-expect-error
      const endpoint = `${req?.hostname}${req?.originalUrl}`
      const method = green(`${req.method}`)
      const statusCode = blue(`${res.statusCode}`)

      return `incoming request: ${statusCode} - ${method} [${endpoint}]`
    },

    // Define a custom success message
    customSuccessMessage: function (req, res) {
      // @ts-expect-error
      const endpoint = `${req?.hostname}${req?.originalUrl}`

      const statusCode = blue(`${res.statusCode}`)
      const method = green(`${req.method}`)

      if (res.statusCode === 404) {
        return `${statusCode} - ${method} [${endpoint}] resource not found`
      }

      return `${statusCode} - ${method} [${endpoint}] completed`
    },

    // Define a custom error message
    customErrorMessage: function (req, res, err) {
      return `request errored with status code: ${res.statusCode}, error : ${err.message}`
    },
  })
}
