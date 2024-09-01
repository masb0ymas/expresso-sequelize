import express, { type Request, type Response } from 'express'
import { env } from '~/config/env'
import { redisService } from '~/config/redis'
import { BASE_URL_SERVER } from '~/core/constants/baseURL'
import ErrorResponse from '~/core/modules/response/ErrorResponse'
import HttpResponse from '~/core/modules/response/HttpResponse'
import { formatDateTime } from '~/core/utils/date'
import db from '~/database/datasource'
import v1Routes from '~/routes/v1'

const route = express.Router()
const expressVersion = require('express/package').version
const sequelizeVersion = require('sequelize/package.json').version
const appVersion = require(`${__dirname}/../../package.json`).version

route.get('/', function index(req: Request, res: Response) {
  let responseData: any = {
    message: 'expresso Sequelize',
    maintaner: 'masb0ymas, <n.fajri@mail.com>',
    source: 'https://github.com/masb0ymas/expresso-sequelize',
  }

  if (env.NODE_ENV !== 'production') {
    responseData = {
      ...responseData,
      docs: `${BASE_URL_SERVER}/v1/api-docs`,
    }
  }

  const httpResponse = HttpResponse.get(responseData)
  res.status(200).json(httpResponse)
})

route.get('/health', async (_req: Request, res: Response) => {
  const startUsage = process.cpuUsage()

  const isConnectedDB = await db.sequelize?.query('SELECT 1')
  const connectedRedis = await redisService.ping()

  const status = {
    timezone: 'ID',
    database: isConnectedDB ? 'Ok' : 'Failed',
    redis: connectedRedis === 'PONG' ? 'Ok' : 'Failed',
    date: formatDateTime(new Date()),
    node: process.version,
    express: `v${expressVersion}`,
    sequelize: `v${sequelizeVersion}`,
    api: `v${appVersion}`,
    platform: process.platform,
    uptime: process.uptime(),
    cpu_usage: process.cpuUsage(startUsage),
    memory: process.memoryUsage(),
  }

  const httpResponse = HttpResponse.get({
    message: 'Server Uptime',
    data: status,
  })
  res.status(200).json(httpResponse)
})

route.get('/v1', function (req: Request, res: Response) {
  const method = req.method
  const url = req.originalUrl
  const host = req.hostname

  const endpoint = `${host}${url}`

  throw new ErrorResponse.Forbidden(
    `Forbidden, wrong access method ${method} endpoint: ${endpoint}`
  )
})

route.use('/v1', v1Routes)

export default route
