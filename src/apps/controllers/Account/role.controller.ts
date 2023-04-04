import authorization from '@apps/middlewares/authorization'
import permissionAccess from '@apps/middlewares/permissionAccess'
import RoleService from '@apps/services/Account/role.service'
import { APP_LANG } from '@config/env'
import ConstRole from '@core/constants/ConstRole'
import asyncHandler from '@core/helpers/asyncHandler'
import HttpResponse from '@core/modules/response/HttpResponse'
import route from '@routes/v1'
import { type Request, type Response } from 'express'
import { arrayFormatter } from 'expresso-core'

route.get(
  '/role',
  authorization,
  asyncHandler(async function findAll(req: Request, res: Response) {
    const data = await RoleService.findAll(req)

    const httpResponse = HttpResponse.get(data)
    res.status(200).json(httpResponse)
  })
)

route.get(
  '/role/:id',
  authorization,
  asyncHandler(async function findById(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const { id } = req.getParams()
    const data = await RoleService.findById(id, { lang: defaultLang })

    const httpResponse = HttpResponse.get({ data })
    res.status(200).json(httpResponse)
  })
)

route.post(
  '/role',
  authorization,
  permissionAccess(ConstRole.ROLE_ADMIN),
  asyncHandler(async function create(req: Request, res: Response) {
    const formData = req.getBody()
    const data = await RoleService.create(formData)

    const httpResponse = HttpResponse.created({ data })
    res.status(201).json(httpResponse)
  })
)

route.put(
  '/role/:id',
  authorization,
  permissionAccess(ConstRole.ROLE_ADMIN),
  asyncHandler(async function update(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const { id } = req.getParams()
    const formData = req.getBody()

    const data = await RoleService.update(id, formData, { lang: defaultLang })

    const httpResponse = HttpResponse.updated({ data })
    res.status(200).json(httpResponse)
  })
)

route.put(
  '/role/restore/:id',
  authorization,
  permissionAccess(ConstRole.ROLE_ADMIN),
  asyncHandler(async function restore(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const { id } = req.getParams()

    await RoleService.restore(id, { lang: defaultLang })

    const httpResponse = HttpResponse.updated({})
    res.status(200).json(httpResponse)
  })
)

route.delete(
  '/role/soft-delete/:id',
  authorization,
  permissionAccess(ConstRole.ROLE_ADMIN),
  asyncHandler(async function softDelete(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const { id } = req.getParams()

    await RoleService.softDelete(id, { lang: defaultLang })

    const httpResponse = HttpResponse.deleted({})
    res.status(200).json(httpResponse)
  })
)

route.delete(
  '/role/force-delete/:id',
  authorization,
  permissionAccess(ConstRole.ROLE_ADMIN),
  asyncHandler(async function forceDelete(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const { id } = req.getParams()

    await RoleService.forceDelete(id, { lang: defaultLang })

    const httpResponse = HttpResponse.deleted({})
    res.status(200).json(httpResponse)
  })
)

route.post(
  '/role/multiple/restore',
  authorization,
  permissionAccess(ConstRole.ROLE_ADMIN),
  asyncHandler(async function multipleRestore(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const formData = req.getBody()
    const arrayIds = arrayFormatter(formData.ids)

    await RoleService.multipleRestore(arrayIds, { lang: defaultLang })

    const httpResponse = HttpResponse.updated({})
    res.status(200).json(httpResponse)
  })
)

route.post(
  '/role/multiple/soft-delete',
  authorization,
  permissionAccess(ConstRole.ROLE_ADMIN),
  asyncHandler(async function multipleSoftDelete(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const formData = req.getBody()
    const arrayIds = arrayFormatter(formData.ids)

    await RoleService.multipleSoftDelete(arrayIds, { lang: defaultLang })

    const httpResponse = HttpResponse.deleted({})
    res.status(200).json(httpResponse)
  })
)

route.post(
  '/role/multiple/force-delete',
  authorization,
  permissionAccess(ConstRole.ROLE_ADMIN),
  asyncHandler(async function multipleForceDelete(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const formData = req.getBody()
    const arrayIds = arrayFormatter(formData.ids)

    await RoleService.multipleForceDelete(arrayIds, { lang: defaultLang })

    const httpResponse = HttpResponse.deleted({})
    res.status(200).json(httpResponse)
  })
)
