/* eslint-disable import/no-duplicates */
import chalk from 'chalk'
import dotenv from 'dotenv'
import { Request } from 'express'
import { IncomingHttpHeaders } from 'http'
import jwt, {
  JsonWebTokenError,
  JwtPayload,
  NotBeforeError,
  TokenExpiredError,
} from 'jsonwebtoken'
import _ from 'lodash'
import ms from 'ms'

dotenv.config()

const { JWT_SECRET_ACCESS_TOKEN }: any = process.env
const JWT_ACCESS_TOKEN_EXPIRED = process.env.JWT_ACCESS_TOKEN_EXPIRED ?? '1d'

interface PayloadAccessToken {
  accessToken: string
  expiresIn: number
}

type DtoVerifyAccessToken =
  | {
      data: null
      message: string
    }
  | {
      data: string | JwtPayload
      message: string
    }
  | undefined

/**
 *
 * @param payload
 * @returns
 */
function generateAccessToken(payload: any): PayloadAccessToken {
  const expiresIn = ms(JWT_ACCESS_TOKEN_EXPIRED) / 1000

  const accessToken = jwt.sign(
    JSON.parse(JSON.stringify(payload)),
    JWT_SECRET_ACCESS_TOKEN,
    { expiresIn }
  )

  return { accessToken, expiresIn }
}

/**
 *
 * @param headers
 * @returns
 */
function getToken(headers: IncomingHttpHeaders): string | null | any {
  if (headers?.authorization) {
    const parted = headers.authorization.split(' ')

    // Check Bearer xxx || JWT xxx
    if (parted[0] === 'Bearer' || parted[0] === 'JWT') {
      if (parted.length === 2) {
        return parted[1]
      }
    }

    return null
  }

  return null
}

/**
 *
 * @param req
 * @returns
 */
function currentToken(req: Request): string {
  const getCookie = req.getCookies()
  const getHeaders = req.getHeaders()

  let curToken = ''

  if (!_.isEmpty(getCookie.token)) {
    curToken = getCookie.token
  } else {
    curToken = getToken(getHeaders)
  }

  return curToken
}

/**
 *
 * @param token
 * @returns
 */
function verifyAccessToken(token: string): DtoVerifyAccessToken {
  try {
    if (!token) {
      return { data: null, message: 'Unauthorized!' }
    }

    const data = jwt.verify(token, JWT_SECRET_ACCESS_TOKEN)
    return { data, message: 'Token is verify' }
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      console.log(chalk.red('JWT Expired Error:'), chalk.green(err.message))
      return { data: null, message: `JWT Expired Error: ${err.message}` }
    }

    if (err instanceof JsonWebTokenError) {
      console.log(chalk.red('JWT Token Error:'), chalk.green(err.message))
      return { data: null, message: `JWT Token Error: ${err.message}` }
    }

    if (err instanceof NotBeforeError) {
      console.log(chalk.red('JWT Not Before Error:'), chalk.green(err.message))
      return { data: null, message: `JWT Not Before Error: ${err.message}` }
    }
  }
}

export { generateAccessToken, getToken, currentToken, verifyAccessToken }
