import express from 'express'
import path from 'path'
import { getRoutes } from '~/core/modules/getRoutes'

const route = express.Router()

const baseRoutes = path.resolve(`${__dirname}/../app/controller`)

export default route

// Mapping Route
getRoutes(baseRoutes)
