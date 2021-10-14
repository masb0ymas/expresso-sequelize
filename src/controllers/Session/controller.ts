import asyncHandler from '@expresso/helpers/asyncHandler'
import HttpResponse from '@expresso/modules/Response/HttpResponse'
import Authorization from '@middlewares/Authorization'
import route from '@routes/v1'
import { Request, Response } from 'express'
import SessionService from './service'

route.get(
  '/session',
  Authorization,
  asyncHandler(async function findAll(req: Request, res: Response) {
    const data = await SessionService.findAll(req)

    const httpResponse = HttpResponse.get(data)
    return res.status(200).json(httpResponse)
  })
)

route.get(
  '/session/:id',
  Authorization,
  asyncHandler(async function findById(req: Request, res: Response) {
    const { id } = req.getParams()

    const data = await SessionService.findById(id)

    const httpResponse = HttpResponse.get({ data })
    return res.status(200).json(httpResponse)
  })
)

route.post(
  '/session',
  Authorization,
  asyncHandler(async function create(req: Request, res: Response) {
    const formData = req.getBody()

    const data = await SessionService.create(formData)

    const httpResponse = HttpResponse.created({ data })
    return res.status(201).json(httpResponse)
  })
)

route.delete(
  '/session/:id',
  Authorization,
  asyncHandler(async function forceDelete(req: Request, res: Response) {
    const { id } = req.getParams()

    await SessionService.delete(id)

    const httpResponse = HttpResponse.deleted({})
    return res.status(200).json(httpResponse)
  })
)
