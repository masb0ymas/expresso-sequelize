import { Request } from 'express'
import jwt from 'jsonwebtoken'
import _ from 'lodash'
import { logger } from '~/config/logger'
import { ms } from '../date'

type JwtTokenParams = {
  secret: string
  expires: string
}

export default class JwtToken {
  private _secret: string
  private _expires: number
  private _expiresIn: number

  constructor({ secret, expires }: JwtTokenParams) {
    this._secret = secret
    this._expires = ms(expires)
    this._expiresIn = Number(this._expires) / 1000
  }

  /**
   * Generate a JWT token
   */
  generate(payload: any) {
    const token = jwt.sign(payload, this._secret, { expiresIn: this._expiresIn })
    return { token, expiresIn: this._expiresIn }
  }

  /**
   * Extract token from request
   */
  extract(req: Request): string | null {
    const queryToken = _.get(req, 'query.token', undefined)
    const cookieToken = _.get(req, 'cookies.token', undefined)
    const headerToken = _.get(req, 'headers.authorization', undefined)

    if (queryToken) {
      logger.info('Token extracted from query')
      return String(queryToken)
    }

    if (cookieToken) {
      logger.info('Token extracted from cookie')
      return String(cookieToken)
    }

    if (headerToken) {
      const splitAuthorize = headerToken.split(' ')
      const allowedAuthorize = ['Bearer', 'JWT', 'Token']

      if (splitAuthorize.length !== 2 || !allowedAuthorize.includes(splitAuthorize[0])) {
        return null
      }

      logger.info('Token extracted from header')
      return String(splitAuthorize[1])
    }

    logger.info('Token not found')
    return null
  }

  /**
   * Verify a JWT token
   */
  verify(token: string) {
    try {
      if (!token) return { data: null, message: 'unauthorized, invalid token' }

      const decoded = jwt.verify(token, this._secret)
      return { data: decoded, message: 'success' }
    } catch (error: any) {
      if (error instanceof jwt.TokenExpiredError) {
        return { data: null, message: `unauthorized, token expired ${error.message || error}` }
      }

      if (error instanceof jwt.JsonWebTokenError) {
        return { data: null, message: `unauthorized, invalid token ${error.message || error}` }
      }

      if (error instanceof jwt.NotBeforeError) {
        return { data: null, message: `unauthorized, token not before ${error.message || error}` }
      }

      return { data: null, message: `unauthorized, invalid token ${error.message || error}` }
    }
  }
}
