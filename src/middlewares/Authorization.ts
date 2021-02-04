import { NextFunction, Request, Response } from 'express'
import { currentToken, verifyAccessToken } from 'helpers/Token'
import { isEmpty } from 'lodash'

async function Authorization(req: Request, res: Response, next: NextFunction) {
  const getToken = currentToken(req)
  const token = verifyAccessToken(getToken)

  if (isEmpty(token?.data)) {
    return res.status(401).json({
      code: 401,
      message: token?.message,
    })
  }

  req.setState({ userLogin: token?.data })
  next()
}

export default Authorization
