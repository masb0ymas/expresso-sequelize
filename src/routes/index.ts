// eslint-disable-next-line no-unused-vars
import express, { Request, Response, NextFunction } from 'express'
import publicRoute from './public'
import privateRoute from './private'

const router = express.Router()

/* GET home page. */
router.get('/', function(req: Request, res: Response, next: NextFunction) {
  res.render('index', { title: 'Express' })
})

router.use('/v1', publicRoute)
router.use('/v1', privateRoute)

export default router
