import { green } from 'colorette'
import { NextFunction, Request, Response } from 'express'
import { In } from 'typeorm'
import { logger } from '~/config/logger'
import { asyncHandler } from '~/lib/async-handler'
import { AppDataSource } from '../database/connection'
import { User } from '../database/entity/user'
import { UserLoginState } from '../database/schema/user'

export function permissionAccess(roleIds: string[]) {
  return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const repo = {
      user: AppDataSource.getRepository(User),
    }

    const { uid: user_id } = req.getState('userLoginState') as UserLoginState
    const getUser = await repo.user.findOne({ where: { id: user_id } })

    const errType = `permitted access error:`
    const errMessage = 'you are not allowed'

    if (getUser && !roleIds.includes(getUser.role_id)) {
      const msgType = green('permission')
      logger.error(`${msgType} - ${errType} ${errMessage}`)

      const result = {
        statusCode: 403,
        error: 'Forbidden',
        message: `${errType} ${errMessage}`,
      }

      return res.status(403).json(result)
    }

    next()
  })
}

export function notPermittedAccess(roleIds: string[]) {
  return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const repo = {
      user: AppDataSource.getRepository(User),
    }

    const { uid: user_id } = req.getState('userLoginState') as UserLoginState
    const getUser = await repo.user.findOne({ where: { id: user_id } })

    const errType = `not permitted access error:`
    const errMessage = 'you are not allowed'

    if (getUser && roleIds.includes(getUser.role_id)) {
      const msgType = green('permission')
      logger.error(`${msgType} - ${errType} ${errMessage}`)

      const result = {
        statusCode: 403,
        error: 'Forbidden',
        message: `${errType} ${errMessage}`,
      }

      return res.status(403).json(result)
    }

    next()
  })
}
