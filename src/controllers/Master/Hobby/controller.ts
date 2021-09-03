import asyncHandler from '@expresso/helpers/asyncHandler'
import { arrayFormatter } from '@expresso/helpers/Common'
import BuildResponse from '@expresso/modules/Response/BuildResponse'
import { Request, Response } from 'express'
import Authorization from 'middlewares/Authorization'
import routes from 'routes/public'
import HobbyService from './service'

routes.get(
  '/hobby',
  asyncHandler(async function getAll(req: Request, res: Response) {
    const data = await HobbyService.getAll(req)
    const buildResponse = BuildResponse.get(data)

    return res.status(200).json(buildResponse)
  })
)

routes.get(
  '/hobby/:id',
  asyncHandler(async function getOne(req: Request, res: Response) {
    const { id } = req.getParams()

    const data = await HobbyService.getOne(id)
    const buildResponse = BuildResponse.get({ data })

    return res.status(200).json(buildResponse)
  })
)

routes.post(
  '/hobby',
  Authorization,
  asyncHandler(async function createData(req: Request, res: Response) {
    const formData = req.getBody()

    const data = await HobbyService.create(formData)
    const buildResponse = BuildResponse.created({ data })

    return res.status(201).json(buildResponse)
  })
)

routes.put(
  '/hobby/:id',
  Authorization,
  asyncHandler(async function updateData(req: Request, res: Response) {
    const { id } = req.getParams()
    const formData = req.getBody()

    const data = await HobbyService.update(id, formData)
    const buildResponse = BuildResponse.updated({ data })

    return res.status(200).json(buildResponse)
  })
)

routes.post(
  '/hobby/multiple/soft-delete',
  Authorization,
  asyncHandler(async function multipleSoftDelete(req: Request, res: Response) {
    const formData = req.getBody()
    const arrayIds = arrayFormatter(formData.ids)

    await HobbyService.multipleDelete(arrayIds)
    const buildResponse = BuildResponse.deleted({})

    return res.status(200).json(buildResponse)
  })
)

routes.post(
  '/hobby/multiple/restore',
  Authorization,
  asyncHandler(async function multipleRestore(req: Request, res: Response) {
    const formData = req.getBody()
    const arrayIds = arrayFormatter(formData.ids)

    await HobbyService.multipleRestore(arrayIds)
    const buildResponse = BuildResponse.updated({})

    return res.status(200).json(buildResponse)
  })
)

routes.post(
  '/hobby/multiple/force-delete',
  Authorization,
  asyncHandler(async function multipleForceDelete(req: Request, res: Response) {
    const formData = req.getBody()
    const arrayIds = arrayFormatter(formData.ids)

    await HobbyService.multipleDelete(arrayIds, true)
    const buildResponse = BuildResponse.deleted({})

    return res.status(200).json(buildResponse)
  })
)

routes.delete(
  '/hobby/soft-delete/:id',
  Authorization,
  asyncHandler(async function softDelete(req: Request, res: Response) {
    const { id } = req.getParams()

    await HobbyService.delete(id)
    const buildResponse = BuildResponse.deleted({})

    return res.status(200).json(buildResponse)
  })
)

routes.put(
  '/hobby/restore/:id',
  Authorization,
  asyncHandler(async function restore(req: Request, res: Response) {
    const { id } = req.getParams()

    await HobbyService.restore(id)
    const buildResponse = BuildResponse.updated({})

    return res.status(200).json(buildResponse)
  })
)

routes.delete(
  '/hobby/force-delete/:id',
  Authorization,
  asyncHandler(async function forceDelete(req: Request, res: Response) {
    const { id } = req.getParams()

    await HobbyService.delete(id, true)
    const buildResponse = BuildResponse.deleted({})

    return res.status(200).json(buildResponse)
  })
)
