// eslint-disable-next-line no-unused-vars
import { NextFunction, Request, Response } from 'express'
import { currentToken, verifyToken } from 'helpers/Token'
import { isEmpty } from 'lodash'

async function Authorization(req: Request, res: Response, next: NextFunction) {
  const getToken = currentToken(req)
  const token = verifyToken(getToken)

  if (isEmpty(token?.data)) {
    return res.status(401).json({
      code: 401,
      message: token?.message,
    })
  }

  next()
}

export default Authorization
