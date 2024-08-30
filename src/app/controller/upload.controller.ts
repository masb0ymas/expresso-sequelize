import { type NextFunction, type Request, type Response } from 'express'
import { arrayFormatter, deleteFile } from 'expresso-core'
import { useMulter } from 'expresso-hooks'
import { FileAttributes } from 'expresso-provider/lib/storage/types'
import _ from 'lodash'
import { env } from '~/config/env'
import ConstRole from '~/core/constants/ConstRole'
import { type IReqOptions } from '~/core/interface/ReqOptions'
import HttpResponse from '~/core/modules/response/HttpResponse'
import { asyncHandler } from '~/core/utils/asyncHandler'
import v1Route from '~/routes/v1'
import authorization from '../middleware/authorization'
import { permissionAccess } from '../middleware/permission'
import UploadService from '../service/upload.service'

const route = v1Route
const routePath = `/upload`
const newUploadService = new UploadService()

route.get(
  `${routePath}`,
  authorization,
  asyncHandler(async function findAll(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? env.APP_LANG
    const options: IReqOptions = { lang: defaultLang }

    const data = await newUploadService.findAll(req)

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
    const data = await newUploadService.findById(id, options)

    const httpResponse = HttpResponse.get({ data }, options)
    res.status(200).json(httpResponse)
  })
)

const uploadFile = useMulter({
  dest: 'public/uploads',
}).fields([{ name: 'file_upload', maxCount: 1 }])

const setFileToBody = asyncHandler(async function setFileToBody(
  req: Request,
  res,
  next: NextFunction
) {
  const file_upload = req.pickSingleFieldMulter(['file_upload'])

  req.setBody(file_upload)
  next()
})

route.post(
  `${routePath}`,
  authorization,
  permissionAccess(ConstRole.ROLE_ADMIN),
  uploadFile,
  setFileToBody,
  asyncHandler(async function create(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? env.APP_LANG
    const options: IReqOptions = { lang: defaultLang }

    const formData = req.getBody()
    const fieldUpload = _.get(formData, 'file_upload', {}) as FileAttributes

    let data

    if (!_.isEmpty(fieldUpload) && !_.isEmpty(fieldUpload.path)) {
      const directory = formData.type ?? 'temp'

      data = await newUploadService.uploadFile({
        fieldUpload,
        directory,
      })

      // delete file after upload to object storage
      deleteFile(fieldUpload.path)
    }

    const httpResponse = HttpResponse.created(
      {
        data: data?.uploadResponse,
        storage: data?.storageResponse,
      },
      options
    )
    res.status(201).json(httpResponse)
  })
)

route.post(
  `${routePath}/presign-url`,
  authorization,
  permissionAccess(ConstRole.ROLE_ADMIN),
  asyncHandler(async function presigned_url(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? env.APP_LANG
    const options: IReqOptions = { lang: defaultLang }

    const { key_file } = req.getBody()
    const data = await newUploadService.getPresignedURL(key_file, options)

    const httpResponse = HttpResponse.updated({ data }, options)
    res.status(200).json(httpResponse)
  })
)

route.put(
  `${routePath}/:id`,
  authorization,
  permissionAccess(ConstRole.ROLE_ADMIN),
  uploadFile,
  setFileToBody,
  asyncHandler(async function update(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? env.APP_LANG
    const options: IReqOptions = { lang: defaultLang }

    const { id } = req.getParams()
    const formData = req.getBody()

    const fieldUpload = _.get(formData, 'file_upload', {}) as FileAttributes

    let data

    if (!_.isEmpty(fieldUpload) && !_.isEmpty(fieldUpload.path)) {
      const directory = formData.type ?? 'temp'

      data = await newUploadService.uploadFile({
        fieldUpload,
        directory,
        upload_id: id,
      })

      // delete file after upload to object storage
      deleteFile(fieldUpload.path)
    }

    const httpResponse = HttpResponse.updated(
      {
        data: data?.uploadResponse,
        storage: data?.storageResponse,
      },
      options
    )
    res.status(200).json(httpResponse)
  })
)

route.put(
  `${routePath}/restore/:id`,
  authorization,
  permissionAccess(ConstRole.ROLE_ADMIN),
  asyncHandler(async function restore(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? env.APP_LANG
    const options: IReqOptions = { lang: defaultLang }

    const { id } = req.getParams()
    await newUploadService.restore(id, options)

    const httpResponse = HttpResponse.updated({}, options)
    res.status(200).json(httpResponse)
  })
)

route.delete(
  `${routePath}/soft-delete/:id`,
  authorization,
  permissionAccess(ConstRole.ROLE_ADMIN),
  asyncHandler(async function softDelete(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? env.APP_LANG
    const options: IReqOptions = { lang: defaultLang }

    const { id } = req.getParams()
    await newUploadService.softDelete(id, options)

    const httpResponse = HttpResponse.deleted({}, options)
    res.status(200).json(httpResponse)
  })
)

route.delete(
  `${routePath}/force-delete/:id`,
  authorization,
  permissionAccess(ConstRole.ROLE_ADMIN),
  asyncHandler(async function forceDelete(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? env.APP_LANG
    const options: IReqOptions = { lang: defaultLang }

    const { id } = req.getParams()
    await newUploadService.forceDelete(id, options)

    const httpResponse = HttpResponse.deleted({}, options)
    res.status(200).json(httpResponse)
  })
)

route.post(
  `${routePath}/multiple/restore`,
  authorization,
  permissionAccess(ConstRole.ROLE_ADMIN),
  asyncHandler(async function multipleRestore(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? env.APP_LANG
    const options: IReqOptions = { lang: defaultLang }

    const formData = req.getBody()
    const arrayIds = arrayFormatter(formData.ids)
    await newUploadService.multipleRestore(arrayIds, options)

    const httpResponse = HttpResponse.updated({}, options)
    res.status(200).json(httpResponse)
  })
)

route.post(
  `${routePath}/multiple/soft-delete`,
  authorization,
  permissionAccess(ConstRole.ROLE_ADMIN),
  asyncHandler(async function multipleSoftDelete(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? env.APP_LANG
    const options: IReqOptions = { lang: defaultLang }

    const formData = req.getBody()
    const arrayIds = arrayFormatter(formData.ids)
    await newUploadService.multipleSoftDelete(arrayIds, options)

    const httpResponse = HttpResponse.deleted({}, options)
    res.status(200).json(httpResponse)
  })
)

route.post(
  `${routePath}/multiple/force-delete`,
  authorization,
  permissionAccess(ConstRole.ROLE_ADMIN),
  asyncHandler(async function multipleForceDelete(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? env.APP_LANG
    const options: IReqOptions = { lang: defaultLang }

    const formData = req.getBody()
    const arrayIds = arrayFormatter(formData.ids)
    await newUploadService.multipleForceDelete(arrayIds, options)

    const httpResponse = HttpResponse.deleted({}, options)
    res.status(200).json(httpResponse)
  })
)
