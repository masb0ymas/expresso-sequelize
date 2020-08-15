/* eslint-disable no-await-in-loop */
/* eslint-disable no-unused-vars */
import models from 'models'
import { Request, Response } from 'express'
import useValidation from 'helpers/useValidation'
import routes from 'routes/private'
import asyncHandler from 'helpers/asyncHandler'
import client, { redisCache, redisDeleteCache } from 'config/redis'
import UserRole from 'models/userrole'
import db from 'models/_instance'
import ResponseError from 'modules/ResponseError'
import schema from './schema'

const { Sequelize } = db
const { Op } = Sequelize

const { User, Role } = models
const { APP_KEY_REDIS } = process.env
// Key Redis Cache
const keyGetAll = `${APP_KEY_REDIS}_user:getAll`

routes.get(
  '/user',
  asyncHandler(async function getAll(req: Request, res: Response) {
    const including = [{ model: Role }]
    const total = await User.count({ include: including })

    client.get(keyGetAll, async (err: any, rowData: string | null) => {
      if (err) {
        console.log(err)
      }

      if (rowData) {
        const data = JSON.parse(rowData)
        return res.status(200).json({ data, total })
      }

      const data = await User.findAll({
        include: including,
      })
      // Cache Redis
      redisCache(keyGetAll, data)
      return res.status(200).json({ data, total })
    })
  })
)

routes.get(
  '/user/:id',
  asyncHandler(async function getOne(req: Request, res: Response) {
    const { id } = req.getParams()
    const data = await User.findByPk(id)

    if (!data) {
      throw new ResponseError.NotFound(
        'Data tidak ditemukan atau sudah terhapus!'
      )
    }

    return res.status(200).json({ data })
  })
)

routes.post(
  '/user',
  asyncHandler(async function createData(req: Request, res: Response) {
    const { Roles } = req.getBody()
    const value = useValidation(schema.create, req.getBody())

    const dataUser = await User.create(value, {
      transaction: await req.getTransaction(),
    })

    // Check Roles is Array, format = ['id_1', 'id_2']
    const arrayRoles = Array.isArray(Roles) ? Roles : JSON.parse(Roles)

    for (let i = 0; i < arrayRoles.length; i += 1) {
      const RoleId = arrayRoles[i]
      const formRole = {
        UserId: dataUser.id,
        RoleId,
      }
      const formDataRole = useValidation(schema.createUserRole, formRole)

      await UserRole.create(formDataRole, {
        transaction: await req.getTransaction(),
      })
    }

    const txn = await req.getTransaction()
    await txn.commit()
    // Delete Cache By Key
    redisDeleteCache(keyGetAll)

    return res.status(201).json({ data: dataUser })
  })
)

routes.put(
  '/user/:id',
  asyncHandler(async function updateData(req: Request, res: Response) {
    const { Roles } = req.getBody()
    const { id } = req.getParams()

    const data = await User.findByPk(id, {
      transaction: await req.getTransaction(),
    })

    if (!data) {
      throw new ResponseError.NotFound(
        'Data tidak ditemukan atau sudah terhapus!'
      )
    }

    // Check Roles is Array, format = ['id_1', 'id_2']
    const arrayRoles = Array.isArray(Roles) ? Roles : JSON.parse(Roles)

    // Destroy data not in UserRole
    await UserRole.destroy({
      where: {
        UserId: id,
        RoleId: {
          [Op.notIn]: arrayRoles,
        },
      },
    })

    for (let i = 0; i < arrayRoles.length; i += 1) {
      const RoleId = arrayRoles[i]
      const formRole = {
        UserId: id,
        RoleId,
      }
      const formDataRole = useValidation(schema.createUserRole, formRole)

      await UserRole.findOrCreate({
        where: formDataRole,
      })
    }

    const value = useValidation(schema.update, {
      ...data.toJSON(),
      ...req.getBody(),
    })

    await data.update(value || {}, { transaction: await req.getTransaction() })
    // Commit Transaction
    const txn = await req.getTransaction()
    await txn.commit()
    // Delete Cache By Key
    redisDeleteCache(keyGetAll)

    return res.status(200).json({ data })
  })
)

routes.delete(
  '/user/:id',
  asyncHandler(async function deleteData(req: Request, res: Response) {
    const { id } = req.getParams()
    const data = await User.findByPk(id)

    if (!data) {
      throw new ResponseError.NotFound(
        'Data tidak ditemukan atau sudah terhapus!'
      )
    }

    // Destroy user data in UserRole
    await UserRole.destroy({
      where: {
        UserId: {
          [Op.in]: id,
        },
      },
    })

    await data.destroy()
    // Delete Cache By Key
    redisDeleteCache(keyGetAll)

    return res.status(200).json({ message: 'Data berhasil dihapus!' })
  })
)
