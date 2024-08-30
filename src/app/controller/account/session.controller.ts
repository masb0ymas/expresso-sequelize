import { type Request, type Response } from 'express'
import authorization from '~/app/middleware/authorization'
import SessionService from '~/app/service/session.service'
import { env } from '~/config/env'
import { type IReqOptions } from '~/core/interface/ReqOptions'
import HttpResponse from '~/core/modules/response/HttpResponse'
import { asyncHandler } from '~/core/utils/asyncHandler'
import v1Route from '~/routes/v1'

const route = v1Route
const routePath = `/session`
const newSessionService = new SessionService()

route.get(
  `${routePath}`,
  authorization,
  asyncHandler(async function findAll(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? env.APP_LANG
    const options: IReqOptions = { lang: defaultLang }

    const data = await newSessionService.findAll(req)

    const httpResponse = HttpResponse.get(data, options)
    res.status(200).json(httpResponse)
  })
)

route.get(
  `${routePath}/:id`,
  authorization,
  asyncHandler(async function findOne(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? env.APP_LANG
    const options: IReqOptions = { lang: defaultLang }

    const { id } = req.getParams()
    const data = await newSessionService.findById(id, options)

    const httpResponse = HttpResponse.get({ data }, options)
    res.status(200).json(httpResponse)
  })
)

route.post(
  `${routePath}`,
  authorization,
  asyncHandler(async function create(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? env.APP_LANG
    const options: IReqOptions = { lang: defaultLang }

    const formData = req.getBody()
    const data = await newSessionService.create(formData)

    const httpResponse = HttpResponse.created({ data }, options)
    res.status(201).json(httpResponse)
  })
)

route.delete(
  `${routePath}/:id`,
  authorization,
  asyncHandler(async function forceDelete(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? env.APP_LANG
    const options: IReqOptions = { lang: defaultLang }

    const { id } = req.getParams()
    await newSessionService.delete(id, options)

    const httpResponse = HttpResponse.deleted({}, options)
    res.status(200).json(httpResponse)
  })
)
