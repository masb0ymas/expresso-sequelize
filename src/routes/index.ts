import { BASE_URL_SERVER } from 'config/baseURL'
import express, { Request, Response, NextFunction } from 'express'
import BuildResponse from 'modules/Response/BuildResponse'
import ResponseError from 'modules/Response/ResponseError'
import publicRoute from 'routes/public'

const router = express.Router()

/* Home Page. */
router.get('/', function (req: Request, res: Response, next: NextFunction) {
  const buildResponse = BuildResponse.get({
    message: 'Express Sequelize TypeScript',
    maintaner: 'masb0ymas, <n.fajri@outlook.com>',
    source:
      'https://github.com/masb0ymas/boilerplate-express-typescript-sequelize',
    docs: `${BASE_URL_SERVER}/v1/api-docs`,
  })
  return res.json(buildResponse)
})

/* Forbidden Page. */
router.get('/v1', function (req: Request, res: Response, next: NextFunction) {
  throw new ResponseError.Forbidden('forbidden, wrong access endpoint')
})

/* Declare Route */
router.use('/v1', publicRoute)

export default router
