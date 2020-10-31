/* eslint-disable no-unused-vars */
import { Request, Response } from 'express'
import routes from 'routes/public'
import asyncHandler from 'helpers/asyncHandler'
import Authorization from 'middlewares/Authorization'
import ResponseSuccess from 'modules/Response/ResponseSuccess'
import UserService from './service'

const { APP_KEY_REDIS } = process.env
// Key Redis Cache
const keyGetAll = `${APP_KEY_REDIS}_user:getAll`

routes.get(
  '/user',
  Authorization,
  asyncHandler(async function getAll(req: Request, res: Response) {
    const { message, data, total } = await UserService.getAll(req)
    const buildResponse = ResponseSuccess.get(message)

    return res.status(200).json({ ...buildResponse, data, total })
  })
)

routes.get(
  '/user/:id',
  Authorization,
  asyncHandler(async function getOne(req: Request, res: Response) {
    const { id } = req.getParams()

    const data = await UserService.getOne(id)
    const buildResponse = ResponseSuccess.get()

    return res.status(200).json({ ...buildResponse, data })
  })
)

routes.post(
  '/user',
  Authorization,
  asyncHandler(async function createData(req: Request, res: Response) {
    const txn = await req.getTransaction()
    const formData = req.getBody()

    const data = await UserService.create(formData, txn)
    const buildResponse = ResponseSuccess.created()

    await txn.commit()
    return res.status(201).json({ ...buildResponse, data })
  })
)

routes.put(
  '/user/:id',
  Authorization,
  asyncHandler(async function updateData(req: Request, res: Response) {
    const txn = await req.getTransaction()
    const formData = req.getBody()
    const { id } = req.getParams()

    const data = await UserService.update(id, formData, txn)
    const buildResponse = ResponseSuccess.updated()

    await txn.commit()
    return res.status(200).json({ ...buildResponse, data })
  })
)

routes.delete(
  '/user/:id',
  Authorization,
  asyncHandler(async function deleteData(req: Request, res: Response) {
    const { id } = req.getParams()
    const { code, message } = await UserService.delete(id)

    return res.status(200).json({ code, message })
  })
)
