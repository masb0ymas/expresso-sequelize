import { Request, Response } from 'express'
import routes from 'routes/public'
import asyncHandler from 'helpers/asyncHandler'
import Authorization from 'middlewares/Authorization'
import BuildResponse from 'modules/Response/BuildResponse'
import RefreshTokenService from 'controllers/RefreshToken/service'

routes.get(
  '/refresh-token',
  asyncHandler(async function getToken(req: Request, res: Response) {
    const { refreshToken } = req.getQuery()

    const data = await RefreshTokenService.getToken(refreshToken)
    const buildResponse = BuildResponse.get({ data })

    return res.status(200).json(buildResponse)
  })
)

routes.post(
  '/refresh-token',
  Authorization,
  asyncHandler(async function createData(req: Request, res: Response) {
    const formData = req.getBody()

    const data = await RefreshTokenService.create(formData)
    const buildResponse = BuildResponse.created({ data })

    return res.status(201).json(buildResponse)
  })
)
