// eslint-disable-next-line no-unused-vars
import { Request } from 'express'
import jwt, {
  TokenExpiredError,
  JsonWebTokenError,
  NotBeforeError,
} from 'jsonwebtoken'
import { isEmpty } from 'lodash'

require('dotenv').config()

const { JWT_SECRET }: any = process.env

// Get Token from headers
function getToken(headers: any) {
  if (headers && headers.authorization) {
    const parted = headers.authorization.split(' ')
    if (parted.length === 2) {
      return parted[1]
    }
    return null
  }
  return null
}

function currentToken(req: Request) {
  const getCookie = req.getCookies()
  const getHeaders = req.getHeaders()

  let curToken = ''
  if (!isEmpty(getCookie.token)) {
    curToken = getCookie.token
  } else {
    curToken = getToken(getHeaders)
  }

  return curToken
}

// Verify Token
function verifyToken(token: string) {
  try {
    if (!token) {
      return { data: null, message: 'Unauthorized!' }
    }

    const data = jwt.verify(token, JWT_SECRET)
    return { data, message: 'Token is verify' }
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return { data: null, message: `Token ${err.message}` }
    }

    if (err instanceof JsonWebTokenError) {
      return { data: null, message: `Token ${err.message}` }
    }

    if (err instanceof NotBeforeError) {
      return { data: null, message: `Token ${err.message}` }
    }
  }
}

export { getToken, currentToken, verifyToken }
