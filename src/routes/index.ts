import { BASE_URL_SERVER } from '@config/baseURL'
import { NODE_ENV } from '@config/env'
import asyncHandler from '@expresso/helpers/asyncHandler'
import { formatDateTime } from '@expresso/helpers/Date'
import HttpResponse from '@expresso/modules/Response/HttpResponse'
import ResponseError from '@expresso/modules/Response/ResponseError'
import v1Route from '@routes/v1'
import Express, { Request, Response } from 'express'

const route = Express.Router()

// Index Route
route.get(
  '/',
  asyncHandler(function (req: Request, res: Response) {
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
    res.json(httpResponse)
  })
)

// Get Health Server
route.get(
  '/health',
  asyncHandler(async function getServerHealth(req: Request, res: Response) {
    const startUsage = process.cpuUsage()

    const status = {
      uptime: process.uptime(),
      status: 'Ok',
      timezone: 'ID',
      date: formatDateTime(new Date()),
      node: process.version,
      memory: process.memoryUsage,
      platform: process.platform,
      cpuUsage: process.cpuUsage(startUsage),
    }

    const httpResponse = HttpResponse.get({
      message: 'Server Uptime',
      data: status,
    })
    res.status(200).json(httpResponse)
  })
)

// Forbidden Api
route.get('/v1', function (req: Request, res: Response) {
  throw new ResponseError.Forbidden(
    `Forbidden, wrong access endpoint: ${req.url}`
  )
})

// Using Route v1
route.use('/v1', v1Route)

export default route
