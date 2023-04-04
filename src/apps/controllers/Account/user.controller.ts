import authorization from '@apps/middlewares/authorization'
import permissionAccess from '@apps/middlewares/permissionAccess'
import UserService from '@apps/services/Account/user.service'
import { APP_LANG } from '@config/env'
import ConstRole from '@core/constants/ConstRole'
import asyncHandler from '@core/helpers/asyncHandler'
import HttpResponse from '@core/modules/response/HttpResponse'
import Role from '@database/entities/Role'
import Session from '@database/entities/Session'
import Upload from '@database/entities/Upload'
import route from '@routes/v1'
import { type Request, type Response } from 'express'
import { arrayFormatter } from 'expresso-core'

route.get(
  '/user',
  authorization,
  asyncHandler(async function findAll(req: Request, res: Response) {
    const data = await UserService.findAll(req)

    const httpResponse = HttpResponse.get(data)
    res.status(200).json(httpResponse)
  })
)

route.get(
  '/user/:id',
  authorization,
  asyncHandler(async function findById(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const { id } = req.getParams()
    const data = await UserService.findById(id, {
      lang: defaultLang,
      include: [{ model: Role }, { model: Upload }, { model: Session }],
    })

    const httpResponse = HttpResponse.get({ data })
    res.status(200).json(httpResponse)
  })
)

route.post(
  '/user',
  authorization,
  permissionAccess(ConstRole.ROLE_ADMIN),
  asyncHandler(async function create(req: Request, res: Response) {
    const formData = req.getBody()
    const data = await UserService.create(formData)

    const httpResponse = HttpResponse.created({ data })
    res.status(201).json(httpResponse)
  })
)

route.put(
  '/user/:id',
  authorization,
  permissionAccess(ConstRole.ROLE_ADMIN),
  asyncHandler(async function update(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const { id } = req.getParams()
    const formData = req.getBody()

    const data = await UserService.update(id, formData, { lang: defaultLang })

    const httpResponse = HttpResponse.updated({ data })
    res.status(200).json(httpResponse)
  })
)

route.put(
  '/user/restore/:id',
  authorization,
  permissionAccess(ConstRole.ROLE_ADMIN),
  asyncHandler(async function restore(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const { id } = req.getParams()

    await UserService.restore(id, { lang: defaultLang })

    const httpResponse = HttpResponse.updated({})
    res.status(200).json(httpResponse)
  })
)

route.delete(
  '/user/soft-delete/:id',
  authorization,
  permissionAccess(ConstRole.ROLE_ADMIN),
  asyncHandler(async function softDelete(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const { id } = req.getParams()

    await UserService.softDelete(id, { lang: defaultLang })

    const httpResponse = HttpResponse.deleted({})
    res.status(200).json(httpResponse)
  })
)

route.delete(
  '/user/force-delete/:id',
  authorization,
  permissionAccess(ConstRole.ROLE_ADMIN),
  asyncHandler(async function forceDelete(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const { id } = req.getParams()

    await UserService.forceDelete(id, { lang: defaultLang })

    const httpResponse = HttpResponse.deleted({})
    res.status(200).json(httpResponse)
  })
)

route.post(
  '/user/multiple/restore',
  authorization,
  permissionAccess(ConstRole.ROLE_ADMIN),
  asyncHandler(async function multipleRestore(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const formData = req.getBody()
    const arrayIds = arrayFormatter(formData.ids)

    await UserService.multipleRestore(arrayIds, { lang: defaultLang })

    const httpResponse = HttpResponse.updated({})
    res.status(200).json(httpResponse)
  })
)

route.post(
  '/user/multiple/soft-delete',
  authorization,
  permissionAccess(ConstRole.ROLE_ADMIN),
  asyncHandler(async function multipleSoftDelete(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const formData = req.getBody()
    const arrayIds = arrayFormatter(formData.ids)

    await UserService.multipleSoftDelete(arrayIds, { lang: defaultLang })

    const httpResponse = HttpResponse.deleted({})
    res.status(200).json(httpResponse)
  })
)

route.post(
  '/user/multiple/force-delete',
  authorization,
  permissionAccess(ConstRole.ROLE_ADMIN),
  asyncHandler(async function multipleForceDelete(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const formData = req.getBody()
    const arrayIds = arrayFormatter(formData.ids)

    await UserService.multipleForceDelete(arrayIds, { lang: defaultLang })

    const httpResponse = HttpResponse.deleted({})
    res.status(200).json(httpResponse)
  })
)
