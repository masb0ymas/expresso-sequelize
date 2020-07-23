/* eslint-disable no-unused-vars */
import models from 'models'
import { Request, Response } from 'express'
import useValidation from 'helpers/useValidation'
import schema from './schema'

const { Role } = models

async function getAll(req: Request, res: Response) {
  const data = await Role.findAll()
  const total = await Role.count()

  return res.status(200).json({ data, total })
}

async function getOne(req: Request, res: Response) {
  const { id } = req.params
  const data = await Role.findByPk(id)

  if (!data) {
    return res.status(404).json({
      message: 'Data tidak ditemukan atau sudah terhapus!',
    })
  }

  return res.status(200).json({ data })
}

async function createRole(req: Request, res: Response) {
  const value = useValidation(schema.create, req.getBody())
  const data = await Role.create(value)

  return res.status(201).json({ data })
}

async function updateRole(req: Request, res: Response) {
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
}

async function deleteRole(req: Request, res: Response) {
  const { id } = req.params
  const data = await Role.findByPk(id)

  if (!data) {
    return res.status(404).json({
      message: 'Data tidak ditemukan atau sudah terhapus!',
    })
  }

  await data.destroy()
  return res.status(200).json({
    message: 'success',
  })
}

const RoleController = { getAll, getOne, createRole, updateRole, deleteRole }

module.exports = RoleController
