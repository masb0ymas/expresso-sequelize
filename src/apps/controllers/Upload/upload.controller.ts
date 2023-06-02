import { type NextFunction, type Request, type Response } from 'express'
import { arrayFormatter, deleteFile } from 'expresso-core'
import { useMulter } from 'expresso-hooks'
import { type FileAttributes } from 'expresso-provider/lib/interface'
import _ from 'lodash'
import authorization from '~/apps/middlewares/authorization'
import permissionAccess from '~/apps/middlewares/permissionAccess'
import UploadService from '~/apps/services/Upload/upload.service'
import { APP_LANG } from '~/config/env'
import ConstRole from '~/core/constants/ConstRole'
import asyncHandler from '~/core/helpers/asyncHandler'
import HttpResponse from '~/core/modules/response/HttpResponse'
import route from '~/routes/v1'

route.get(
  '/upload',
  authorization,
  asyncHandler(async function findAll(req: Request, res: Response) {
    const data = await UploadService.findAll(req)

    const httpResponse = HttpResponse.get(data)
    res.status(200).json(httpResponse)
  })
)

route.get(
  '/upload/:id',
  authorization,
  asyncHandler(async function findById(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const { id } = req.getParams()
    const data = await UploadService.findById(id, { lang: defaultLang })

    const httpResponse = HttpResponse.get({ data })
    res.status(200).json(httpResponse)
  })
)

const uploadFile = useMulter({
  dest: 'public/uploads',
}).fields([{ name: 'fileUpload', maxCount: 1 }])

const setFileToBody = asyncHandler(async function setFileToBody(
  req: Request,
  res,
  next: NextFunction
) {
  const fileUpload = req.pickSingleFieldMulter(['fileUpload'])

  req.setBody(fileUpload)
  next()
})

route.post(
  '/upload',
  authorization,
  permissionAccess(ConstRole.ROLE_ADMIN),
  uploadFile,
  setFileToBody,
  asyncHandler(async function create(req: Request, res: Response) {
    const formData = req.getBody()
    const fieldUpload = _.get(formData, 'fileUpload', {}) as FileAttributes

    let data

    if (!_.isEmpty(fieldUpload) && !_.isEmpty(fieldUpload.path)) {
      const directory = formData.type ?? 'uploads'

      data = await UploadService.uploadFile({
        fieldUpload,
        directory,
      })

      // delete file after upload to object storage
      deleteFile(fieldUpload.path)
    }

    const httpResponse = HttpResponse.created({
      data: data?.uploadResponse,
      storage: data?.storageResponse,
    })
    res.status(201).json(httpResponse)
  })
)

route.post(
  '/upload/presign-url',
  authorization,
  permissionAccess(ConstRole.ROLE_ADMIN),
  asyncHandler(async function presignedURL(req: Request, res: Response) {
    const { keyFile } = req.getBody()

    const data = await UploadService.getPresignedURL(keyFile)

    const httpResponse = HttpResponse.updated({ data })
    res.status(200).json(httpResponse)
  })
)

route.put(
  '/upload/:id',
  authorization,
  permissionAccess(ConstRole.ROLE_ADMIN),
  uploadFile,
  setFileToBody,
  asyncHandler(async function update(req: Request, res: Response) {
    const { id } = req.getParams()
    const formData = req.getBody()

    const fieldUpload = _.get(formData, 'fileUpload', {}) as FileAttributes

    let data

    if (!_.isEmpty(fieldUpload) && !_.isEmpty(fieldUpload.path)) {
      const directory = formData.type ?? 'uploads'

      data = await UploadService.uploadFile({
        fieldUpload,
        directory,
        UploadId: id,
      })

      // delete file after upload to object storage
      deleteFile(fieldUpload.path)
    }

    const httpResponse = HttpResponse.updated({
      data: data?.uploadResponse,
      storage: data?.storageResponse,
    })
    res.status(200).json(httpResponse)
  })
)

route.put(
  '/upload/restore/:id',
  authorization,
  permissionAccess(ConstRole.ROLE_ADMIN),
  asyncHandler(async function restore(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const { id } = req.getParams()

    await UploadService.restore(id, { lang: defaultLang })

    const httpResponse = HttpResponse.updated({})
    res.status(200).json(httpResponse)
  })
)

route.delete(
  '/upload/soft-delete/:id',
  authorization,
  permissionAccess(ConstRole.ROLE_ADMIN),
  asyncHandler(async function softDelete(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const { id } = req.getParams()

    await UploadService.softDelete(id, { lang: defaultLang })

    const httpResponse = HttpResponse.deleted({})
    res.status(200).json(httpResponse)
  })
)

route.delete(
  '/upload/force-delete/:id',
  authorization,
  permissionAccess(ConstRole.ROLE_ADMIN),
  asyncHandler(async function forceDelete(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const { id } = req.getParams()

    await UploadService.forceDelete(id, { lang: defaultLang })

    const httpResponse = HttpResponse.deleted({})
    res.status(200).json(httpResponse)
  })
)

route.post(
  '/upload/multiple/restore',
  authorization,
  permissionAccess(ConstRole.ROLE_ADMIN),
  asyncHandler(async function multipleRestore(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const formData = req.getBody()
    const arrayIds = arrayFormatter(formData.ids)

    await UploadService.multipleRestore(arrayIds, { lang: defaultLang })

    const httpResponse = HttpResponse.updated({})
    res.status(200).json(httpResponse)
  })
)

route.post(
  '/upload/multiple/soft-delete',
  authorization,
  permissionAccess(ConstRole.ROLE_ADMIN),
  asyncHandler(async function multipleSoftDelete(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const formData = req.getBody()
    const arrayIds = arrayFormatter(formData.ids)

    await UploadService.multipleSoftDelete(arrayIds, { lang: defaultLang })

    const httpResponse = HttpResponse.deleted({})
    res.status(200).json(httpResponse)
  })
)

route.post(
  '/upload/multiple/force-delete',
  authorization,
  permissionAccess(ConstRole.ROLE_ADMIN),
  asyncHandler(async function multipleForceDelete(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const formData = req.getBody()
    const arrayIds = arrayFormatter(formData.ids)

    await UploadService.multipleForceDelete(arrayIds, { lang: defaultLang })

    const httpResponse = HttpResponse.deleted({})
    res.status(200).json(httpResponse)
  })
)
