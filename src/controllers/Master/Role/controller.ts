import ConstRoles from '@expresso/constants/ConstRoles'
import asyncHandler from '@expresso/helpers/asyncHandler'
import { arrayFormatter } from '@expresso/helpers/Common'
import { formatDateGenerateFile } from '@expresso/helpers/Date'
import { writeFileStream } from '@expresso/helpers/File'
import useMulter, { allowedExcel } from '@expresso/hooks/useMulter'
import BuildResponse from '@expresso/modules/Response/BuildResponse'
import { BASE_URL_SERVER } from 'config/baseURL'
import { NextFunction, Request, Response } from 'express'
import { get } from 'lodash'
import Authorization from 'middlewares/Authorization'
import PermissionAccess from 'middlewares/PermissionAccess'
import routes from 'routes/public'
import RoleService from './service'

routes.get(
  '/role',
  Authorization,
  PermissionAccess([ConstRoles.ID_ADMIN]),
  asyncHandler(async function getAll(req: Request, res: Response) {
    const data = await RoleService.getAll(req)
    const buildResponse = BuildResponse.get(data)

    return res.status(200).json(buildResponse)
  })
)

routes.get(
  '/role/generate-excel',
  Authorization,
  PermissionAccess([ConstRoles.ID_ADMIN]),
  asyncHandler(async function generateExcelEvent(req: Request, res: Response) {
    const streamExcel = await RoleService.generateExcel(req)
    const dateNow = formatDateGenerateFile(new Date())
    const filename = `${dateNow}_generate_role.xlsx`

    const outputPath = `public/generate/excel/${filename}`
    writeFileStream(outputPath, streamExcel)

    const url = outputPath.replace('public', BASE_URL_SERVER)
    const buildResponse = BuildResponse.get({ data: { url } })

    return res.status(200).json(buildResponse)
  })
)

routes.get(
  '/role/export-excel',
  Authorization,
  PermissionAccess([ConstRoles.ID_ADMIN]),
  asyncHandler(async function generateExcelEvent(req: Request, res: Response) {
    const streamExcel = await RoleService.generateExcel(req)
    const dateNow = formatDateGenerateFile(new Date())
    const filename = `${dateNow}_generate_role.xlsx`

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`)
    res.setHeader('Content-Length', streamExcel.length)

    return res.send(streamExcel)
  })
)

routes.get(
  '/role/:id',
  Authorization,
  PermissionAccess([ConstRoles.ID_ADMIN]),
  asyncHandler(async function getOne(req: Request, res: Response) {
    const { id } = req.getParams()

    const data = await RoleService.getOne(id)
    const buildResponse = BuildResponse.get({ data })

    return res.status(200).json(buildResponse)
  })
)

const uploadFile = useMulter({
  dest: 'public/uploads/excel',
  allowedExt: allowedExcel,
}).fields([{ name: 'fileExcel', maxCount: 1 }])

const setFileToBody = asyncHandler(async function setFileToBody(
  req: Request,
  res,
  next: NextFunction
) {
  const fileExcel = req.pickSingleFieldMulter(['fileExcel'])

  req.setBody(fileExcel)
  next()
})

routes.post(
  '/role/import-excel',
  Authorization,
  PermissionAccess([ConstRoles.ID_ADMIN]),
  uploadFile,
  setFileToBody,
  asyncHandler(async function importExcel(req: Request, res: Response) {
    const formData = req.getBody()
    const fieldExcel = get(formData, 'fileExcel', {})

    const data = await RoleService.importExcel(fieldExcel)
    const buildResponse = BuildResponse.created(data)

    return res.status(200).json(buildResponse)
  })
)

routes.post(
  '/role',
  Authorization,
  PermissionAccess([ConstRoles.ID_ADMIN]),
  asyncHandler(async function createData(req: Request, res: Response) {
    const formData = req.getBody()

    const data = await RoleService.create(formData)
    const buildResponse = BuildResponse.created({ data })

    return res.status(201).json(buildResponse)
  })
)

routes.put(
  '/role/:id',
  Authorization,
  PermissionAccess([ConstRoles.ID_ADMIN]),
  asyncHandler(async function updateData(req: Request, res: Response) {
    const { id } = req.getParams()
    const formData = req.getBody()

    const data = await RoleService.update(id, formData)
    const buildResponse = BuildResponse.updated({ data })

    return res.status(200).json(buildResponse)
  })
)

routes.post(
  '/role/multiple/soft-delete',
  Authorization,
  PermissionAccess([ConstRoles.ID_ADMIN]),
  asyncHandler(async function multipleSoftDelete(req: Request, res: Response) {
    const formData = req.getBody()
    const arrayIds = arrayFormatter(formData.ids)

    await RoleService.multipleDelete(arrayIds)
    const buildResponse = BuildResponse.deleted({})

    return res.status(200).json(buildResponse)
  })
)

routes.post(
  '/role/multiple/restore',
  Authorization,
  PermissionAccess([ConstRoles.ID_ADMIN]),
  asyncHandler(async function multipleRestore(req: Request, res: Response) {
    const formData = req.getBody()
    const arrayIds = arrayFormatter(formData.ids)

    await RoleService.multipleRestore(arrayIds)
    const buildResponse = BuildResponse.updated({})

    return res.status(200).json(buildResponse)
  })
)

routes.post(
  '/role/multiple/force-delete',
  Authorization,
  PermissionAccess([ConstRoles.ID_ADMIN]),
  asyncHandler(async function multipleForceDelete(req: Request, res: Response) {
    const formData = req.getBody()
    const arrayIds = arrayFormatter(formData.ids)

    await RoleService.multipleDelete(arrayIds, true)
    const buildResponse = BuildResponse.deleted({})

    return res.status(200).json(buildResponse)
  })
)

routes.delete(
  '/role/soft-delete/:id',
  Authorization,
  PermissionAccess([ConstRoles.ID_ADMIN]),
  asyncHandler(async function softDelete(req: Request, res: Response) {
    const { id } = req.getParams()

    await RoleService.delete(id)
    const buildResponse = BuildResponse.deleted({})

    return res.status(200).json(buildResponse)
  })
)

routes.put(
  '/role/restore/:id',
  Authorization,
  PermissionAccess([ConstRoles.ID_ADMIN]),
  asyncHandler(async function restore(req: Request, res: Response) {
    const { id } = req.getParams()

    await RoleService.restore(id)
    const buildResponse = BuildResponse.updated({})

    return res.status(200).json(buildResponse)
  })
)

routes.delete(
  '/role/force-delete/:id',
  Authorization,
  PermissionAccess([ConstRoles.ID_ADMIN]),
  asyncHandler(async function forceDelete(req: Request, res: Response) {
    const { id } = req.getParams()

    await RoleService.delete(id, true)
    const buildResponse = BuildResponse.deleted({})

    return res.status(200).json(buildResponse)
  })
)
