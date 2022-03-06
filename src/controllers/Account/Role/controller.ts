import { APP_LANG } from '@config/env'
import ConstRole from '@expresso/constants/ConstRole'
import asyncHandler from '@expresso/helpers/asyncHandler'
import { arrayFormatter } from '@expresso/helpers/Formatter'
import HttpResponse from '@expresso/modules/Response/HttpResponse'
import Authorization from '@middlewares/Authorization'
import PermissionAccess from '@middlewares/PermissionAccess'
import route from '@routes/v1'
import { Request, Response } from 'express'
import RoleService from './service'

const onlyAdmin = [ConstRole.ID_SUPER_ADMIN, ConstRole.ID_ADMIN]

route.get(
  '/role',
  Authorization,
  PermissionAccess(onlyAdmin),
  asyncHandler(async function findAll(req: Request, res: Response) {
    const data = await RoleService.findAll(req)

    const httpResponse = HttpResponse.get(data)
    res.status(200).json(httpResponse)
  })
)

route.get(
  '/role/:id',
  Authorization,
  PermissionAccess(onlyAdmin),
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
  Authorization,
  PermissionAccess(onlyAdmin),
  asyncHandler(async function create(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const formData = req.getBody()

    const data = await RoleService.create(formData, { lang: defaultLang })

    const httpResponse = HttpResponse.created({ data })
    res.status(201).json(httpResponse)
  })
)

route.put(
  '/role/:id',
  Authorization,
  PermissionAccess(onlyAdmin),
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
  Authorization,
  PermissionAccess(onlyAdmin),
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
  Authorization,
  PermissionAccess(onlyAdmin),
  asyncHandler(async function softDelete(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const { id } = req.getParams()

    await RoleService.delete(id, { lang: defaultLang })

    const httpResponse = HttpResponse.deleted({})
    res.status(200).json(httpResponse)
  })
)

route.delete(
  '/role/force-delete/:id',
  Authorization,
  PermissionAccess(onlyAdmin),
  asyncHandler(async function forceDelete(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const { id } = req.getParams()

    await RoleService.delete(id, { force: true, lang: defaultLang })

    const httpResponse = HttpResponse.deleted({})
    res.status(200).json(httpResponse)
  })
)

route.post(
  '/role/multiple/restore',
  Authorization,
  PermissionAccess(onlyAdmin),
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
  Authorization,
  PermissionAccess(onlyAdmin),
  asyncHandler(async function multipleSoftDelete(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const formData = req.getBody()
    const arrayIds = arrayFormatter(formData.ids)

    await RoleService.multipleDelete(arrayIds, { lang: defaultLang })

    const httpResponse = HttpResponse.deleted({})
    res.status(200).json(httpResponse)
  })
)

route.post(
  '/role/multiple/force-delete',
  Authorization,
  PermissionAccess(onlyAdmin),
  asyncHandler(async function multipleSoftDelete(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const formData = req.getBody()
    const arrayIds = arrayFormatter(formData.ids)

    await RoleService.multipleDelete(arrayIds, {
      force: true,
      lang: defaultLang,
    })

    const httpResponse = HttpResponse.deleted({})
    res.status(200).json(httpResponse)
  })
)
