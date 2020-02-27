/* eslint-disable no-unused-vars */
import express, { Request, Response, NextFunction } from 'express'

const router = express.Router()

/* GET user page. */
router.get('/', function(req: Request, res: Response, next: NextFunction) {
  res.send('respond with a resource')
})

export default router
