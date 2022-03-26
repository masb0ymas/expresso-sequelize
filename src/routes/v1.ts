import { getRoutes } from '@expresso/helpers/Routing'
import Express from 'express'
import path from 'path'

const route = Express.Router()

const baseRoutes = path.resolve(`${__dirname}/../controllers`)

export default route

// Mapping Route
getRoutes(baseRoutes)
