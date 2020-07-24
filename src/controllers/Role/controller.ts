/* eslint-disable no-unused-vars */
import models from 'models'
import { Request, Response } from 'express'
import useValidation from 'helpers/useValidation'
import routes from 'routes/public'
import asyncHandler from 'helpers/asyncHandler'
import client from 'config/redis'
import schema from './schema'

const { Role } = models

routes.get(
  '/role',
  asyncHandler(async function getAll(req: Request, res: Response) {
    const keyRoleGetAll = 'role:getAll'

    const total = await Role.count()

    client.get(keyRoleGetAll, async (err: any, rowData: any) => {
      if (err) {
        console.log(err)
      }

      if (rowData) {
        const data = JSON.parse(rowData)
        return res.status(200).json({ data, total })
      }

      const data = await Role.findAll()
      client.setex(keyRoleGetAll, 8600, JSON.stringify(data))
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
      return res.status(404).json({
        message: 'Data tidak ditemukan atau sudah terhapus!',
      })
    }

    return res.status(200).json({ data })
  })
)

routes.post(
  '/role',
  asyncHandler(async function createRole(req: Request, res: Response) {
    const value = useValidation(schema.create, req.getBody())
    const data = await Role.create(value)

    return res.status(201).json({ data })
  })
)

routes.put(
  '/role/:id',
  asyncHandler(async function updateRole(req: Request, res: Response) {
    const { id } = req.params

    const data = await Role.findByPk(id)

    if (!data) {
      return res.status(404).json({
        message: 'Data tidak ditemukan atau sudah terhapus!',
      })
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
  asyncHandler(async function deleteRole(req: Request, res: Response) {
    const { id } = req.params
    const data = await Role.findByPk(id)

    if (!data) {
      return res.status(404).json({
        message: 'Data tidak ditemukan atau sudah terhapus!',
      })
    }

    await data.destroy()
    return res.status(200).json({
      message: 'Data berhasil dihapus!',
    })
  })
)
