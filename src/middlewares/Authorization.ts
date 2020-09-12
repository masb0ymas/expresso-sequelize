// eslint-disable-next-line no-unused-vars
import { NextFunction, Request, Response } from 'express'
import { verifyToken } from 'helpers/Token'
import { isEmpty } from 'lodash'

async function Authorization(req: Request, res: Response, next: NextFunction) {
  const token = verifyToken(req.getHeaders())

  if (isEmpty(token?.data)) {
    return res.status(401).json({
      message: token?.message,
    })
  }

  next()
}

export default Authorization
