import { BASE_URL_SERVER } from '@config/baseURL'
import { formatDateTime } from '@expresso/helpers/Date'
import HttpResponse from '@expresso/modules/Response/HttpResponse'
import ResponseError from '@expresso/modules/Response/ResponseError'
import v1Route from '@routes/v1'
import Express, { Request, Response } from 'express'

const { NODE_ENV } = process.env
const route = Express.Router()

/**
 * Index Route
 */
route.get('/', function (req: Request, res: Response) {
  let responseData: any = {
    message: 'expresso',
    maintaner: 'masb0ymas, <n.fajri@outlook.com>',
    source: 'https://github.com/masb0ymas/expresso',
  }

  if (NODE_ENV !== 'production') {
    responseData = {
      ...responseData,
      docs: `${BASE_URL_SERVER}/v1/api-docs`,
    }
  }

  const httpResponse = HttpResponse.get(responseData)
  return res.json(httpResponse)
})

route.get('/health', function (req: Request, res: Response) {
  const startUsage = process.cpuUsage()

  const status = {
    uptime: process.uptime(),
    message: 'Ok',
    timezone: 'ID',
    date: formatDateTime(new Date()),
    node: process.version,
    memory: process.memoryUsage,
    platform: process.platform,
    cpuUsage: process.cpuUsage(startUsage),
  }

  res.status(200).json({ status })
})

/* Forbidden Page. */
route.get('/v1', function (req: Request, res: Response) {
  throw new ResponseError.Forbidden(
    `Forbidden, wrong access endpoint: ${req.url}`
  )
})

route.use('/v1', v1Route)

export default route
