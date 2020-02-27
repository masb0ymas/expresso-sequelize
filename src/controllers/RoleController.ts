/* eslint-disable no-unused-vars */
import { Request, Response } from 'express'
import Role, { iRole } from '../models/role'

async function getAll(req: Request, res: Response) {
  try {
    const data = await Role.findAll()

    const totalRow = await Role.count()

    return res.status(200).json({ data, totalRow })
  } catch (e) {
    return res.status(400).json({ message: e.message })
  }
}

async function getOne(req: Request, res: Response) {
  const { params } = req
  try {
    const data = await Role.findByPk(params.id)

    if (!data) {
      return res.status(400).json({ message: 'Data tidak ditemukan!' })
    }

    return res.status(200).json({ data })
  } catch (e) {
    return res.status(400).json({ message: e.message })
  }
}

async function create(req: Request, res: Response) {
  const { body } = req
  try {
    const rawFormData: iRole = { ...body }
    const data = await Role.create(rawFormData)

    return res.status(200).json({ data, message: 'Data berhasil ditambahkan!' })
  } catch (e) {
    return res.status(400).json({ message: e.message })
  }
}

export default { getAll, getOne, create }
