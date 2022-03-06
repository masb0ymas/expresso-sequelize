import { APP_LANG } from '@config/env'
import asyncHandler from '@expresso/helpers/asyncHandler'
import { deleteFile } from '@expresso/helpers/File'
import { arrayFormatter } from '@expresso/helpers/Formatter'
import useMulter from '@expresso/hooks/useMulter'
import { FileAttributes } from '@expresso/interfaces/Files'
import HttpResponse from '@expresso/modules/Response/HttpResponse'
import Authorization from '@middlewares/Authorization'
import route from '@routes/v1'
import { NextFunction, Request, Response } from 'express'
import _ from 'lodash'
import UploadService from './service'

route.get(
  '/upload',
  Authorization,
  asyncHandler(async function findAll(req: Request, res: Response) {
    const data = await UploadService.findAll(req)

    const httpResponse = HttpResponse.get(data)
    res.status(200).json(httpResponse)
  })
)

route.get(
  '/upload/:id',
  Authorization,
  asyncHandler(async function findById(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const { id } = req.getParams()

    const data = await UploadService.findById(id, { lang: defaultLang })

    const httpResponse = HttpResponse.get({ data })
    res.status(200).json(httpResponse)
  })
)

route.post(
  '/upload/presign-url',
  Authorization,
  asyncHandler(async function findById(req: Request, res: Response) {
    const { keyFile } = req.getBody()

    // signed url from bucket S3
    const signedUrl = await UploadService.getSignedUrlS3(keyFile)

    const httpResponse = HttpResponse.get({ data: signedUrl })
    res.status(200).json(httpResponse)
  })
)

const uploadFile = useMulter({
  dest: 'public/uploads/temp',
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
  Authorization,
  uploadFile,
  setFileToBody,
  asyncHandler(async function create(req: Request, res: Response) {
    const formData = req.getBody()

    const fieldUpload = _.get(formData, 'fileUpload', {}) as FileAttributes

    let dataS3
    let UploadData

    // Upload to AWS S3
    if (!_.isEmpty(fieldUpload) && !_.isEmpty(fieldUpload.path)) {
      const directory = formData.type ?? 'uploads'

      const resUploadS3 = await UploadService.uploadFileWithSignedUrl(
        fieldUpload,
        directory
      )

      dataS3 = resUploadS3.dataAwsS3
      UploadData = resUploadS3.resUpload

      deleteFile(fieldUpload.path)
    }

    const httpResponse = HttpResponse.created({
      data: UploadData,
      AwsS3: dataS3,
    })
    res.status(201).json(httpResponse)
  })
)

route.put(
  '/upload/:id',
  Authorization,
  uploadFile,
  setFileToBody,
  asyncHandler(async function update(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const { id } = req.getParams()
    const formData = req.getBody()

    const fieldUpload = _.get(formData, 'fileUpload', {}) as FileAttributes

    let dataS3
    let UploadData

    // Upload to AWS S3
    if (!_.isEmpty(fieldUpload) && !_.isEmpty(fieldUpload.path)) {
      const directory = formData.type ?? 'uploads'

      const resUploadS3 = await UploadService.uploadFileWithSignedUrl(
        fieldUpload,
        directory,
        id
      )

      dataS3 = resUploadS3.dataAwsS3
      UploadData = resUploadS3.resUpload

      deleteFile(fieldUpload.path)
    } else {
      // get upload file
      const getUpload = await UploadService.findById(id, { lang: defaultLang })

      UploadData = getUpload
    }

    const httpResponse = HttpResponse.updated({
      data: UploadData,
      AwsS3: dataS3,
    })
    res.status(200).json(httpResponse)
  })
)

route.put(
  '/upload/restore/:id',
  Authorization,
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
  Authorization,
  asyncHandler(async function softDelete(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const { id } = req.getParams()

    await UploadService.delete(id, { lang: defaultLang })

    const httpResponse = HttpResponse.deleted({})
    res.status(200).json(httpResponse)
  })
)

route.delete(
  '/upload/force-delete/:id',
  Authorization,
  asyncHandler(async function forceDelete(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const { id } = req.getParams()

    await UploadService.delete(id, { force: true, lang: defaultLang })

    const httpResponse = HttpResponse.deleted({})
    res.status(200).json(httpResponse)
  })
)

route.post(
  '/upload/multiple/restore',
  Authorization,
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
  Authorization,
  asyncHandler(async function multipleSoftDelete(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const formData = req.getBody()
    const arrayIds = arrayFormatter(formData.ids)

    await UploadService.multipleDelete(arrayIds, { lang: defaultLang })

    const httpResponse = HttpResponse.deleted({})
    res.status(200).json(httpResponse)
  })
)

route.post(
  '/upload/multiple/force-delete',
  Authorization,
  asyncHandler(async function multipleSoftDelete(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const formData = req.getBody()
    const arrayIds = arrayFormatter(formData.ids)

    await UploadService.multipleDelete(arrayIds, {
      force: true,
      lang: defaultLang,
    })

    const httpResponse = HttpResponse.deleted({})
    res.status(200).json(httpResponse)
  })
)
