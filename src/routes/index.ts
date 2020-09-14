// eslint-disable-next-line no-unused-vars
import express, { Request, Response, NextFunction } from 'express'
import publicRoute from './public'

const router = express.Router()

/* Home Page. */
router.get('/', function (req: Request, res: Response, next: NextFunction) {
  res.render('index', {
    title: 'Express TS',
    description: 'Powered by Nusantech',
  })
})

/* Forbidden Page. */
router.get('/v1', function (req: Request, res: Response, next: NextFunction) {
  res.render('index', {
    title: 'Hayo Mau ngapain ??',
    description: 'Forbidden Access',
    code: '403',
  })
})

/* Declare Route */
router.use('/v1', publicRoute)

/* Not Found Page. */
router.get('*', function (req: Request, res: Response, next: NextFunction) {
  res.render('index', {
    title: 'Oops, Halaman tidak ditemukan!',
    description: 'Not Found',
    code: '404',
  })
})

export default router
