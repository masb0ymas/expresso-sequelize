/* eslint-disable no-await-in-loop */
import asyncHandler from '@expresso/helpers/asyncHandler'
import { arrayFormatter } from '@expresso/helpers/Common'
import useMulter, { allowedImage } from '@expresso/hooks/useMulter'
import { FileAttributes } from '@expresso/interfaces/file'
import BuildResponse from '@expresso/modules/Response/BuildResponse'
import UserService from 'controllers/User/service'
import UserRoleService from 'controllers/UserRole/service'
import { NextFunction, Request, Response } from 'express'
import fs from 'fs'
import { get } from 'lodash'
import Authorization from 'middlewares/Authorization'
import { UserInstance } from 'models/user'
import routes from 'routes/public'
import sharp from 'sharp'
import createDirNotExist from 'utils/Directory'

const baseDestination = 'public/uploads/profile'

async function createDirectory() {
  const pathDirectory = [`./${baseDestination}/resize`]

  pathDirectory.map((x) => createDirNotExist(x))
}

routes.get(
  '/user',
  Authorization,
  asyncHandler(async function getAll(req: Request, res: Response) {
    const data = await UserService.getAll(req)
    const buildResponse = BuildResponse.get(data)

    return res.status(200).json(buildResponse)
  })
)

routes.get(
  '/user/:id/session',
  Authorization,
  asyncHandler(async function getUserWithSession(req: Request, res: Response) {
    const { id } = req.getParams()

    const data = await UserService.getUserWithSession(id)
    const buildResponse = BuildResponse.get({ data })

    return res.status(200).json(buildResponse)
  })
)

routes.get(
  '/user/:id',
  Authorization,
  asyncHandler(async function getOne(req: Request, res: Response) {
    const { id } = req.getParams()

    const data = await UserService.getOne(id)
    const buildResponse = BuildResponse.get({ data })

    return res.status(200).json(buildResponse)
  })
)

const uploadFile = useMulter({
  dest: baseDestination,
  allowedExt: allowedImage,
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

routes.post(
  '/user',
  Authorization,
  uploadFile,
  setFileToBody,
  asyncHandler(async function createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const txn = await req.getTransaction()
    const formData = req.getBody()

    const fieldImage = get(formData, 'profileImage', {}) as FileAttributes
    const pathImage = fieldImage.path
      ? fieldImage.path.replace('public', '')
      : null

    await createDirectory()

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

    const data = await UserService.create(newFormData, txn)
    req.setState({ userData: data, newFormData })

    next()
  }),
  asyncHandler(async function createUserRole(req: Request, res: Response) {
    const txn = await req.getTransaction()
    const data = req.getState('userData') as UserInstance
    const Roles = req.getState('formData.Roles') as string[]

    // Check Roles is Array, format = ['id_1', 'id_2']
    const arrayRoles = arrayFormatter(Roles)

    const listUserRole = []
    for (let i = 0; i < arrayRoles.length; i += 1) {
      const RoleId: string = arrayRoles[i]
      const formData = {
        UserId: data.id,
        RoleId,
      }

      listUserRole.push(formData)
    }
    await UserRoleService.bulkCreate(listUserRole, txn)

    await txn.commit()
    const buildResponse = BuildResponse.created({ data })

    return res.status(201).json(buildResponse)
  })
)

routes.put(
  '/user/:id',
  Authorization,
  uploadFile,
  setFileToBody,
  asyncHandler(async function updateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const txn = await req.getTransaction()
    const formData = req.getBody()
    const { id } = req.getParams()

    const fieldImage = get(formData, 'profileImage', {}) as FileAttributes
    const pathImage = fieldImage.path
      ? fieldImage.path.replace('public', '')
      : null

    await createDirectory()

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

    const data = await UserService.update(id, newFormData, txn)
    req.setState({ userData: data, newFormData })

    next()
  }),
  asyncHandler(async function updateUserRole(req: Request, res: Response) {
    const txn = await req.getTransaction()
    const data = req.getState('userData') as UserInstance
    const Roles = req.getState('formData.Roles') as string[]

    // Check Roles is Array, format = ['id_1', 'id_2']
    const arrayRoles = arrayFormatter(Roles)

    // Destroy data not in UserRole
    await UserRoleService.deleteNotInRoleId(data.id, arrayRoles)

    for (let i = 0; i < arrayRoles.length; i += 1) {
      const RoleId: string = arrayRoles[i]
      const formRole = {
        UserId: data.id,
        RoleId,
      }

      await UserRoleService.findOrCreate(formRole)
    }
    await txn.commit()
    const buildResponse = BuildResponse.updated({ data })

    return res.status(200).json(buildResponse)
  })
)

routes.post(
  '/user/multiple/soft-delete',
  Authorization,
  asyncHandler(async function multipleSoftDelete(req: Request, res: Response) {
    const formData = req.getBody()
    const arrayIds = arrayFormatter(formData.ids)

    await UserService.multipleDelete(arrayIds)
    const buildResponse = BuildResponse.deleted({})

    return res.status(200).json(buildResponse)
  })
)

routes.post(
  '/user/multiple/restore',
  Authorization,
  asyncHandler(async function multipleRestore(req: Request, res: Response) {
    const formData = req.getBody()
    const arrayIds = arrayFormatter(formData.ids)

    await UserService.multipleRestore(arrayIds)
    const buildResponse = BuildResponse.updated({})

    return res.status(200).json(buildResponse)
  })
)

routes.post(
  '/user/multiple/force-delete',
  Authorization,
  asyncHandler(async function multipleForceDelete(req: Request, res: Response) {
    const formData = req.getBody()
    const arrayIds = arrayFormatter(formData.ids)

    await UserService.multipleDelete(arrayIds, true)
    const buildResponse = BuildResponse.deleted({})

    return res.status(200).json(buildResponse)
  })
)

routes.delete(
  '/user/soft-delete/:id',
  Authorization,
  asyncHandler(async function softDelete(req: Request, res: Response) {
    const { id } = req.getParams()

    await UserService.delete(id)
    const buildResponse = BuildResponse.deleted({})

    return res.status(200).json(buildResponse)
  })
)

routes.put(
  '/user/restore/:id',
  Authorization,
  asyncHandler(async function restore(req: Request, res: Response) {
    const { id } = req.getParams()

    await UserService.restore(id)
    const buildResponse = BuildResponse.updated({})

    return res.status(200).json(buildResponse)
  })
)

routes.delete(
  '/user/force-delete/:id',
  Authorization,
  asyncHandler(async function forceDelete(req: Request, res: Response) {
    const { id } = req.getParams()

    await UserService.delete(id, true)
    const buildResponse = BuildResponse.deleted({})

    return res.status(200).json(buildResponse)
  })
)
