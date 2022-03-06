import { APP_LANG } from '@config/env'
import ConstRole from '@expresso/constants/ConstRole'
import asyncHandler from '@expresso/helpers/asyncHandler'
import { arrayFormatter } from '@expresso/helpers/Formatter'
import HttpResponse from '@expresso/modules/Response/HttpResponse'
import Authorization from '@middlewares/Authorization'
import PermissionAccess from '@middlewares/PermissionAccess'
import route from '@routes/v1'
import { Request, Response } from 'express'
import NotificationService from './service'

const onlyAdmin = [ConstRole.ID_SUPER_ADMIN, ConstRole.ID_ADMIN]

route.get(
  '/notification',
  Authorization,
  asyncHandler(async function findAll(req: Request, res: Response) {
    const data = await NotificationService.findAll(req)

    const httpResponse = HttpResponse.get(data)
    res.status(200).json(httpResponse)
  })
)

route.get(
  '/notification/:id',
  Authorization,
  asyncHandler(async function findById(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const { id } = req.getParams()

    const data = await NotificationService.findById(id, { lang: defaultLang })

    const httpResponse = HttpResponse.get({ data })
    res.status(200).json(httpResponse)
  })
)

route.post(
  '/notification',
  Authorization,
  PermissionAccess(onlyAdmin),
  asyncHandler(async function create(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const formData = req.getBody()

    const data = await NotificationService.create(formData, {
      lang: defaultLang,
    })

    const httpResponse = HttpResponse.created({ data })
    res.status(201).json(httpResponse)
  })
)

route.put(
  '/notification/:id',
  Authorization,
  PermissionAccess(onlyAdmin),
  asyncHandler(async function update(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const { id } = req.getParams()
    const formData = req.getBody()

    const data = await NotificationService.update(id, formData, {
      lang: defaultLang,
    })

    const httpResponse = HttpResponse.updated({ data })
    res.status(200).json(httpResponse)
  })
)

route.put(
  '/notification/restore/:id',
  Authorization,
  PermissionAccess(onlyAdmin),
  asyncHandler(async function restore(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const { id } = req.getParams()

    await NotificationService.restore(id, { lang: defaultLang })

    const httpResponse = HttpResponse.updated({})
    res.status(200).json(httpResponse)
  })
)

route.delete(
  '/notification/soft-delete/:id',
  Authorization,
  PermissionAccess(onlyAdmin),
  asyncHandler(async function softDelete(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const { id } = req.getParams()

    await NotificationService.delete(id, { lang: defaultLang })

    const httpResponse = HttpResponse.deleted({})
    res.status(200).json(httpResponse)
  })
)

route.delete(
  '/notification/force-delete/:id',
  Authorization,
  PermissionAccess(onlyAdmin),
  asyncHandler(async function forceDelete(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const { id } = req.getParams()

    await NotificationService.delete(id, { force: true, lang: defaultLang })

    const httpResponse = HttpResponse.deleted({})
    res.status(200).json(httpResponse)
  })
)

route.post(
  '/notification/multiple/restore',
  Authorization,
  PermissionAccess(onlyAdmin),
  asyncHandler(async function multipleRestore(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const formData = req.getBody()
    const arrayIds = arrayFormatter(formData.ids)

    await NotificationService.multipleRestore(arrayIds, { lang: defaultLang })

    const httpResponse = HttpResponse.updated({})
    res.status(200).json(httpResponse)
  })
)

route.post(
  '/notification/multiple/soft-delete',
  Authorization,
  PermissionAccess(onlyAdmin),
  asyncHandler(async function multipleSoftDelete(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const formData = req.getBody()
    const arrayIds = arrayFormatter(formData.ids)

    await NotificationService.multipleDelete(arrayIds, { lang: defaultLang })

    const httpResponse = HttpResponse.deleted({})
    res.status(200).json(httpResponse)
  })
)

route.post(
  '/notification/multiple/force-delete',
  Authorization,
  PermissionAccess(onlyAdmin),
  asyncHandler(async function multipleSoftDelete(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const formData = req.getBody()
    const arrayIds = arrayFormatter(formData.ids)

    await NotificationService.multipleDelete(arrayIds, {
      force: true,
      lang: defaultLang,
    })

    const httpResponse = HttpResponse.deleted({})
    res.status(200).json(httpResponse)
  })
)
