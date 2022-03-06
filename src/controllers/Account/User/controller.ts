import { BASE_URL_SERVER } from '@config/baseURL'
import { APP_LANG } from '@config/env'
import ConstRole from '@expresso/constants/ConstRole'
import asyncHandler from '@expresso/helpers/asyncHandler'
import { createDirNotExist, writeFileStream } from '@expresso/helpers/File'
import { arrayFormatter } from '@expresso/helpers/Formatter'
import useMulter, {
  allowedImage,
  allowedMimetypeImage,
} from '@expresso/hooks/useMulter'
import { FileAttributes } from '@expresso/interfaces/Files'
import HttpResponse from '@expresso/modules/Response/HttpResponse'
import Authorization from '@middlewares/Authorization'
import PermissionAccess from '@middlewares/PermissionAccess'
import route from '@routes/v1'
import { NextFunction, Request, Response } from 'express'
import fs from 'fs'
import _ from 'lodash'
import sharp from 'sharp'
import UserService from './service'

const baseDestination = 'public/uploads/profile'

async function createDirectory(): Promise<void> {
  const pathDirectory = [`./${baseDestination}/resize`]
  pathDirectory.map((x) => createDirNotExist(x))
}

const onlyAdmin = [ConstRole.ID_SUPER_ADMIN, ConstRole.ID_ADMIN]

route.get(
  '/user',
  Authorization,
  PermissionAccess(onlyAdmin),
  asyncHandler(async function findAll(req: Request, res: Response) {
    const data = await UserService.findAll(req)

    const httpResponse = HttpResponse.get(data)
    res.status(200).json(httpResponse)
  })
)

route.get(
  '/user/generate-excel',
  Authorization,
  PermissionAccess(onlyAdmin),
  asyncHandler(async function generateExcelEvent(req: Request, res: Response) {
    const streamExcel = await UserService.generateExcel(req)
    const filename = `${Date.now()}_generate_user.xlsx`

    const outputPath = `public/generate/excel/${filename}`
    writeFileStream(outputPath, streamExcel)
    const url = outputPath.replace('public', BASE_URL_SERVER)

    const httpResponse = HttpResponse.get({ data: { url } })
    res.status(200).json(httpResponse)
  })
)

route.get(
  '/user/export-excel',
  Authorization,
  PermissionAccess(onlyAdmin),
  asyncHandler(async function generateExcelEvent(req: Request, res: Response) {
    const streamExcel = await UserService.generateExcel(req)
    const filename = `${Date.now()}_export_user.xlsx`

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`)
    res.setHeader('Content-Length', streamExcel.length)

    res.send(streamExcel)
  })
)

route.get(
  '/user/:id/session',
  Authorization,
  PermissionAccess(onlyAdmin),
  asyncHandler(async function findUserWithSession(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const { id } = req.getParams()

    const data = await UserService.findUserWithSession(id, {
      lang: defaultLang,
    })

    const httpResponse = HttpResponse.get({ data })
    res.status(200).json(httpResponse)
  })
)

route.get(
  '/user/:id',
  Authorization,
  PermissionAccess(onlyAdmin),
  asyncHandler(async function findById(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const { id } = req.getParams()

    const data = await UserService.findById(id, { lang: defaultLang })

    const httpResponse = HttpResponse.get({ data })
    res.status(200).json(httpResponse)
  })
)

const uploadFile = useMulter({
  dest: baseDestination,
  allowedExt: allowedImage,
  allowedMimetype: allowedMimetypeImage,
  limit: {
    fieldSize: 50 * 1024 * 1024, // 50 mb
    fileSize: 20 * 1024 * 1024, // 20 mb
  },
}).fields([{ name: 'profileImage', maxCount: 1 }])

const setFileToBody = asyncHandler(async function setFileToBody(
  req: Request,
  res,
  next: NextFunction
) {
  const profileImage = req.pickSingleFieldMulter(['profileImage'])

  req.setBody(profileImage)
  next()
})

route.post(
  '/user',
  Authorization,
  PermissionAccess(onlyAdmin),
  uploadFile,
  setFileToBody,
  asyncHandler(async function create(req: Request, res: Response) {
    await createDirectory()
    const txn = await req.getTransaction()
    const formData = req.getBody()

    const fieldImage = _.get(formData, 'profileImage', {}) as FileAttributes
    const pathImage = fieldImage.path
      ? fieldImage.path.replace('public', '')
      : null

    let pathPhotoResize

    if (pathImage) {
      pathPhotoResize = `${baseDestination}/resize/${fieldImage.filename}`

      await sharp(fieldImage.path)
        .resize(500)
        .jpeg({ quality: 50 })
        .png({ quality: 50 })
        .toFile(pathPhotoResize)

      fs.unlinkSync(fieldImage.path)
    }

    const profilePath = pathPhotoResize
      ? pathPhotoResize.replace('public', '')
      : pathImage

    const newFormData = {
      ...formData,
      picturePath: profilePath,
    }

    const data = await UserService.create(newFormData, { transaction: txn })

    await txn.commit()
    const httpResponse = HttpResponse.created({ data })
    res.status(201).json(httpResponse)
  })
)

route.put(
  '/user/:id',
  Authorization,
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
  Authorization,
  PermissionAccess(onlyAdmin),
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
  Authorization,
  PermissionAccess(onlyAdmin),
  asyncHandler(async function softDelete(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const { id } = req.getParams()

    await UserService.delete(id, { lang: defaultLang })

    const httpResponse = HttpResponse.deleted({})
    res.status(200).json(httpResponse)
  })
)

route.delete(
  '/user/force-delete/:id',
  Authorization,
  PermissionAccess(onlyAdmin),
  asyncHandler(async function forceDelete(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const { id } = req.getParams()

    await UserService.delete(id, { force: true, lang: defaultLang })

    const httpResponse = HttpResponse.deleted({})
    res.status(200).json(httpResponse)
  })
)

route.post(
  '/user/multiple/restore',
  Authorization,
  PermissionAccess(onlyAdmin),
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
  Authorization,
  PermissionAccess(onlyAdmin),
  asyncHandler(async function multipleSoftDelete(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const formData = req.getBody()
    const arrayIds = arrayFormatter(formData.ids)

    await UserService.multipleDelete(arrayIds, { lang: defaultLang })

    const httpResponse = HttpResponse.deleted({})
    res.status(200).json(httpResponse)
  })
)

route.post(
  '/user/multiple/force-delete',
  Authorization,
  PermissionAccess(onlyAdmin),
  asyncHandler(async function multipleSoftDelete(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const formData = req.getBody()
    const arrayIds = arrayFormatter(formData.ids)

    await UserService.multipleDelete(arrayIds, {
      force: true,
      lang: defaultLang,
    })

    const httpResponse = HttpResponse.deleted({})
    res.status(200).json(httpResponse)
  })
)
