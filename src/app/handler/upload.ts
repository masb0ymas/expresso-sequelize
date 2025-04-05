import express, { NextFunction, Request, Response } from 'express'
import _ from 'lodash'
import { asyncHandler } from '~/lib/async-handler'
import { deleteFile } from '~/lib/fs/delete-file'
import HttpResponse from '~/lib/http/response'
import { FileParams } from '~/lib/storage/types'
import { useMulter } from '~/lib/upload/multer'
import authorization from '../middleware/authorization'
import UploadService from '../service/upload'

const route = express.Router()
const service = new UploadService()

const uploadFile = useMulter({
  dest: 'public/uploads/temp',
}).fields([{ name: 'file_upload', maxCount: 1 }])

const setFileToBody = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const file_upload = req.pickSingleFieldMulter(['file_upload'])
  req.setBody(file_upload)
  next()
})

route.get(
  '/',
  authorization(),
  asyncHandler(async (req: Request, res: Response) => {
    const { page, pageSize, filtered, sorted } = req.getQuery()
    const records = await service.find({ page, pageSize, filtered, sorted })
    const httpResponse = HttpResponse.get({ data: records })
    res.status(200).json(httpResponse)
  })
)

route.get(
  '/:id',
  authorization(),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.getParams()
    const record = await service.findById(id)
    const httpResponse = HttpResponse.get({ data: record })
    res.status(200).json(httpResponse)
  })
)

route.post(
  '/',
  authorization(),
  uploadFile,
  setFileToBody,
  asyncHandler(async (req: Request, res: Response) => {
    const formValues = req.getBody()
    const file_upload = _.get(formValues, 'file_upload', {}) as FileParams

    let data

    if (!_.isEmpty(file_upload) && !_.isEmpty(file_upload.path)) {
      const directory = formValues.directory || 'uploads'

      data = await service.uploadFile({ file: file_upload, directory })

      // delete file after upload to object storage
      deleteFile(file_upload.path)
    }

    const httpResponse = HttpResponse.created({ data: data?.upload, storage: data?.storage })
    res.status(201).json(httpResponse)
  })
)

route.get(
  '/presigned-url',
  authorization(),
  asyncHandler(async (req: Request, res: Response) => {
    const { keyfile } = req.getBody()
    const record = await service.findWithPresignedUrl(keyfile)
    const httpResponse = HttpResponse.get({ data: record })
    res.status(200).json(httpResponse)
  })
)

route.put(
  '/:id',
  authorization(),
  uploadFile,
  setFileToBody,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.getParams()
    const formValues = req.getBody()
    const file_upload = _.get(formValues, 'file_upload', {}) as FileParams

    let data

    if (!_.isEmpty(file_upload) && !_.isEmpty(file_upload.path)) {
      const directory = formValues.directory || 'uploads'

      data = await service.uploadFile({ file: file_upload, directory, upload_id: id })

      // delete file after upload to object storage
      deleteFile(file_upload.path)
    }

    const record = await service.update(id, formValues)
    const httpResponse = HttpResponse.updated({ data: record, storage: data?.storage })
    res.status(200).json(httpResponse)
  })
)

route.put(
  '/restore/:id',
  authorization(),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.getParams()
    await service.restore(id)
    const httpResponse = HttpResponse.updated({})
    res.status(200).json(httpResponse)
  })
)

route.delete(
  '/soft-delete/:id',
  authorization(),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.getParams()
    await service.softDelete(id)
    const httpResponse = HttpResponse.deleted({})
    res.status(200).json(httpResponse)
  })
)

route.delete(
  '/force-delete/:id',
  authorization(),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.getParams()
    await service.forceDelete(id)
    const httpResponse = HttpResponse.deleted({})
    res.status(200).json(httpResponse)
  })
)

export { route as UploadHandler }
