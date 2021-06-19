import BuildResponse from '@expresso/modules/Response/BuildResponse'
import ResponseError from '@expresso/modules/Response/ResponseError'
import { BASE_URL_SERVER } from 'config/baseURL'
import express, { NextFunction, Request, Response } from 'express'
import publicRoute from 'routes/public'

const { NODE_ENV } = process.env
const router = express.Router()

/* Home Page. */
router.get('/', function (req: Request, res: Response, next: NextFunction) {
  let responseData: any = {
    message: 'expresso ( Express TS Sequelize )',
    maintaner: 'masb0ymas, <n.fajri@outlook.com>',
    source: 'https://github.com/masb0ymas/expresso',
  }

  if (NODE_ENV !== 'production') {
    responseData = {
      ...responseData,
      docs: `${BASE_URL_SERVER}/v1/api-docs`,
    }
  }

  const buildResponse = BuildResponse.get(responseData)
  return res.json(buildResponse)
})

/* Forbidden Page. */
router.get('/v1', function (req: Request, res: Response, next: NextFunction) {
  throw new ResponseError.Forbidden('forbidden, wrong access endpoint')
})

/* Declare Route */
router.use('/v1', publicRoute)

export default router
