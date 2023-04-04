import { getRoutes } from '@core/helpers/routing'
import Express from 'express'
import path from 'path'

const route = Express.Router()

const baseRoutes = path.resolve(`${__dirname}/../apps/controllers`)

export default route

// Mapping Route
getRoutes(baseRoutes)
