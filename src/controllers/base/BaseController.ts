/* eslint-disable no-unused-vars */
import { Request, Response } from 'express'

function createBaseController(
  modelMaster: any,
  modelValidation: any,
  options: any
) {
  const { configGetAll, confitGetOne } = options || {}

  async function getAll(req: Request, res: Response) {
    try {
      const data = await modelMaster.findAll()

      const totalRow = await modelMaster.count()

      return res.status(200).json({ data, totalRow })
    } catch (e) {
      return res.status(400).json({ message: e.message })
    }
  }

  async function getOne(req: Request, res: Response) {
    const { params } = req
    try {
      const data = await modelMaster.findByPk(params.id)

      if (!data) {
        return res
          .status(400)
          .json({ message: 'Data tidak ditemukan atau sudah terhapus!' })
      }

      return res.status(200).json({ data })
    } catch (e) {
      return res.status(400).json({ message: e.message })
    }
  }

  async function create(req: Request, res: Response) {
    const { body } = req
    try {
      const rawFormData = { ...body }
      const data = await modelMaster.create(rawFormData)

      return res
        .status(200)
        .json({ data, message: 'Data berhasil ditambahkan!' })
    } catch (e) {
      return res.status(400).json({ message: e.message })
    }
  }

  async function update(req: Request, res: Response) {
    const { body, params } = req
    try {
      const rawFormData = { ...body }
      const data = await modelMaster.findByPk(params.id)

      if (!data) {
        return res
          .status(400)
          .json({ message: 'Data tidak ditemukan atau sudah terhapus!' })
      }

      await data.update(rawFormData)
      return res.status(200).json({ data, message: 'Data sudah diperbarui!' })
    } catch (e) {
      return res.status(400).json({ message: e.message })
    }
  }

  async function destroy(req: Request, res: Response) {
    const { params } = req
    try {
      const data = await modelMaster.findByPk(params.id)

      if (!data) {
        return res
          .status(400)
          .json({ message: 'Data tidak ditemukan atau sudah terhapus!' })
      }

      await data.destroy()
      return res.status(200).json({ message: 'Data berhasil dihapus!' })
    } catch (e) {
      return res.status(400).json({ message: e.message })
    }
  }

  return { getAll, getOne, create, update, destroy }
}

export default createBaseController
