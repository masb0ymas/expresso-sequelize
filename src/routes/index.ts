/* eslint-disable no-unused-vars */
import express, { Request, Response, NextFunction } from 'express'
import Role from '../models/role'

const router = express.Router()

/* GET home page. */
router.get('/', function(req: Request, res: Response, next: NextFunction) {
  res.render('index', { title: 'Express' })
})

router.get('/role', async function(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await Role.findAll()
    return res.status(200).json({ data, message: 'berhasil' })
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
})

router.post('/role', async function(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { body } = req
  try {
    const data = await Role.create({
      ...body,
    })
    return res.status(200).json({ data, message: 'data berhasil ditambahkan' })
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
})

export default router
