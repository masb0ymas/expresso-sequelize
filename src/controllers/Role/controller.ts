/* eslint-disable no-unused-vars */
import models from 'models'
import { Request, Response } from 'express'
import useValidation from 'helpers/useValidation'
import routes, { AuthMiddleware } from 'routes/public'
import asyncHandler from 'helpers/asyncHandler'
import client, { redisCache, redisDeleteCache } from 'config/redis'
import ResponseError from 'modules/ResponseError'
import schema from './schema'

const { Role } = models
const { APP_NAME } = process.env
// Key Redis Cache
const keyGetAll = `${APP_NAME}_role:getAll`

routes.get(
  '/role',
  asyncHandler(async function getAll(req: Request, res: Response) {
    const total = await Role.count()

    client.get(keyGetAll, async (err: any, rowData: string | null) => {
      if (err) {
        console.log(err)
      }

      if (rowData) {
        const data = JSON.parse(rowData)
        return res.status(200).json({ data, total })
      }

      const data = await Role.findAll()
      // Cache Redis
      redisCache(keyGetAll, data)

      return res.status(200).json({ data, total })
    })
  })
)

routes.get(
  '/role/:id',
  asyncHandler(async function getOne(req: Request, res: Response) {
    const { id } = req.params
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
    // Delete Cache By Key
    redisDeleteCache(keyGetAll)

    return res.status(201).json({
      data,
    })
  })
)

routes.put(
  '/role/:id',
  AuthMiddleware,
  asyncHandler(async function updateData(req: Request, res: Response) {
    const { id } = req.params

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
    // Delete Cache By Key
    redisDeleteCache(keyGetAll)

    return res.status(200).json({ data })
  })
)

routes.delete(
  '/role/:id',
  AuthMiddleware,
  asyncHandler(async function deleteData(req: Request, res: Response) {
    const { id } = req.params
    const data = await Role.findByPk(id)

    if (!data) {
      throw new ResponseError.NotFound(
        'Data tidak ditemukan atau sudah terhapus!'
      )
    }

    await data.destroy()
    // Delete Cache By Key
    redisDeleteCache(keyGetAll)

    return res.status(200).json({
      message: 'Data berhasil dihapus!',
    })
  })
)
