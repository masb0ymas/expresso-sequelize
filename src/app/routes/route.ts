import express, { Request, Response } from 'express'
import { asyncHandler } from '~/lib/async-handler'
import HttpResponse from '~/lib/http/response'
import { __dirname, require } from '~/lib/string'
import { v1Route } from './v1'

const route = express.Router()

function versioning() {
  const node_modules = `${__dirname}/node_modules`
  const express = require(`${node_modules}/express/package.json`).version
  const app = require(`${__dirname}/package.json`).version

  return { express: `v${express}`, app: `v${app}` }
}

route.get(
  '/',
  asyncHandler(async (_req: Request, res: Response) => {
    const httpResponse = HttpResponse.get({ data: 'Hello World!' })
    res.status(200).json(httpResponse)
  })
)

route.get(
  '/health',
  asyncHandler(async (_req: Request, res: Response) => {
    const startUsage = process.cpuUsage()
    const version = versioning()

    const status = {
      date: new Date().toISOString(),
      node: process.version,
      express: version.express,
      api: version.app,
      platform: process.platform,
      uptime: process.uptime(),
      cpu_usage: process.cpuUsage(startUsage),
      memory: process.memoryUsage(),
    }

    const httpResponse = HttpResponse.get({ data: status })
    res.status(200).json(httpResponse)
  })
)

route.use('/v1', v1Route)

export { route as Route }
