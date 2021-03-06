/* eslint-disable no-await-in-loop */
import { NextFunction, Request, Response } from 'express'
import routes from 'routes/public'
import asyncHandler from 'helpers/asyncHandler'
import Authorization from 'middlewares/Authorization'
import BuildResponse from 'modules/Response/BuildResponse'
import UserService from 'controllers/User/service'
import { arrayFormatter } from 'helpers/Common'
import { UserInstance } from 'models/user'
import UserRoleService from 'controllers/UserRole/service'

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

routes.post(
  '/user',
  Authorization,
  asyncHandler(async function createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const txn = await req.getTransaction()
    const formData = req.getBody()

    const data = await UserService.create(formData, txn)
    req.setState({ userData: data, formData })

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
  asyncHandler(async function updateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const txn = await req.getTransaction()
    const formData = req.getBody()
    const { id } = req.getParams()

    const data = await UserService.update(id, formData, txn)
    req.setState({ userData: data, formData })

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
  '/user/delete/:id',
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
  '/user/:id',
  Authorization,
  asyncHandler(async function softDelete(req: Request, res: Response) {
    const { id } = req.getParams()

    await UserService.delete(id, true)
    const buildResponse = BuildResponse.deleted({})

    return res.status(200).json(buildResponse)
  })
)
