/* eslint-disable no-unused-vars */
import { Request, Response } from 'express'
import routes from 'routes/public'
import asyncHandler from 'helpers/asyncHandler'
import Authorization from 'middlewares/Authorization'
import UserService from './service'

const { APP_KEY_REDIS } = process.env
// Key Redis Cache
const keyGetAll = `${APP_KEY_REDIS}_user:getAll`

routes.get(
  '/user',
  Authorization,
  asyncHandler(async function getAll(req: Request, res: Response) {
    const { data, total } = await UserService.getAll(req)
    return res.status(200).json({ data, total })
  })
)

routes.get(
  '/user/:id',
  Authorization,
  asyncHandler(async function getOne(req: Request, res: Response) {
    const { id } = req.getParams()
    const data = await UserService.getOne(id)

    return res.status(200).json({ data })
  })
)

routes.post(
  '/user',
  Authorization,
  asyncHandler(async function createData(req: Request, res: Response) {
    const txn = await req.getTransaction()
    const formData = req.getBody()

    const { message, data, dataUserRole } = await UserService.create(
      formData,
      txn
    )

    await txn.commit()
    return res.status(201).json({ message, data, dataUserRole })
  })
)

routes.put(
  '/user/:id',
  Authorization,
  asyncHandler(async function updateData(req: Request, res: Response) {
    const txn = await req.getTransaction()
    const formData = req.getBody()
    const { id } = req.getParams()

    const { message, data, dataUserRole } = await UserService.update(
      id,
      formData,
      txn
    )

    await txn.commit()
    return res.status(200).json({ message, data, dataUserRole })
  })
)

routes.delete(
  '/user/:id',
  Authorization,
  asyncHandler(async function deleteData(req: Request, res: Response) {
    const { id } = req.getParams()
    const { message } = await UserService.delete(id)

    return res.status(200).json({ message })
  })
)
