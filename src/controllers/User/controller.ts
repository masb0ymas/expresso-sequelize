/* eslint-disable no-unused-vars */
import { FilterQueryAttributes } from 'models'
import { Request, Response } from 'express'
import routes from 'routes/private'
import asyncHandler from 'helpers/asyncHandler'
import UserService from './service'

const { APP_KEY_REDIS } = process.env
// Key Redis Cache
const keyGetAll = `${APP_KEY_REDIS}_user:getAll`

routes.get(
  '/user',
  asyncHandler(async function getAll(req: Request, res: Response) {
    const {
      page,
      pageSize,
      filtered,
      sorted,
    }: FilterQueryAttributes = req.getQuery()

    const { data, total } = await UserService.getAll(
      page,
      pageSize,
      filtered,
      sorted
    )

    return res.status(200).json({ data, total })
  })
)

routes.get(
  '/user/:id',
  asyncHandler(async function getOne(req: Request, res: Response) {
    const { id } = req.getParams()
    const data = await UserService.getOne(id)

    return res.status(200).json({ data })
  })
)

routes.post(
  '/user',
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
  asyncHandler(async function deleteData(req: Request, res: Response) {
    const { id } = req.getParams()
    const { message } = await UserService.delete(id)

    return res.status(200).json({ message })
  })
)
