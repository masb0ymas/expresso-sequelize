/* eslint-disable no-unused-vars */
import models from 'models'
import { Request, Response } from 'express'
import useValidation from 'helpers/useValidation'
import routes, { AuthMiddleware } from 'routes/public'
import asyncHandler from 'helpers/asyncHandler'
import ResponseError from 'modules/ResponseError'
import { filterQueryObject, iFilterQuery } from 'helpers/Common'
import schema from './schema'

const { Role } = models
const { APP_KEY_REDIS } = process.env
// Key Redis Cache
const keyGetAll = `${APP_KEY_REDIS}_role:getAll`

routes.get(
  '/role',
  asyncHandler(async function getAll(req: Request, res: Response) {
    // eslint-disable-next-line prefer-const
    let { page, pageSize, filtered, sorted }: iFilterQuery = req.getQuery()

    let filterObject = {}
    if (!page) page = 0
    if (!pageSize) pageSize = 10

    filterObject = filtered ? filterQueryObject(JSON.parse(filtered)) : []

    const data = await Role.findAll({
      where: filterObject,
      offset: Number(pageSize) * Number(page),
      limit: Number(pageSize),
      order: [['createdAt', 'desc']],
    })
    const total = await Role.count({
      where: filterObject,
    })

    return res.status(200).json({ data, total })
  })
)

routes.get(
  '/role/:id',
  asyncHandler(async function getOne(req: Request, res: Response) {
    const { id } = req.getParams()
    const data = await Role.findByPk(id)

    if (!data) {
      throw new ResponseError.NotFound(
        'Data tidak ditemukan atau sudah terhapus!'
      )
    }

    return res.status(200).json({ data })
  })
)

routes.post(
  '/role',
  AuthMiddleware,
  asyncHandler(async function createData(req: Request, res: Response) {
    const value = useValidation(schema.create, req.getBody())
    const data = await Role.create(value)

    return res.status(201).json({ data })
  })
)

routes.put(
  '/role/:id',
  AuthMiddleware,
  asyncHandler(async function updateData(req: Request, res: Response) {
    const { id } = req.getParams()
    const data = await Role.findByPk(id)

    if (!data) {
      throw new ResponseError.NotFound(
        'Data tidak ditemukan atau sudah terhapus!'
      )
    }

    const value = useValidation(schema.create, {
      ...data.toJSON(),
      ...req.getBody(),
    })

    await data.update(value || {})

    return res.status(200).json({ data })
  })
)

routes.delete(
  '/role/:id',
  AuthMiddleware,
  asyncHandler(async function deleteData(req: Request, res: Response) {
    const { id } = req.getParams()
    const data = await Role.findByPk(id)

    if (!data) {
      throw new ResponseError.NotFound(
        'Data tidak ditemukan atau sudah terhapus!'
      )
    }

    await data.destroy()

    return res.status(200).json({ message: 'Data berhasil dihapus!' })
  })
)
