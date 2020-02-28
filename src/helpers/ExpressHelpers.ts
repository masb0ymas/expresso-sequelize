// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express'
import { isObject, get } from 'lodash'
import Sequelize from 'sequelize'
// import models from '../models'

// const { sequelize } = models

class ResponseError extends Error {
  statusCode: any

  constructor(message: any, statusCode = 500) {
    super(message)
    this.message = message
    this.statusCode = statusCode
  }
}

function generateErrorResponseError(e: any) {
  return isObject(e.message) ? e.message : { message: e.message }
}

function generateErrorSequelize(e: any) {
  const errors = get(e, 'errors', [])
  const errorMessage = get(errors, '0.message', null)
  return {
    message: errorMessage ? `Validation error: ${errorMessage}` : e.message,
    errors: errors.reduce((acc: any, curVal: any) => {
      acc[curVal.path] = curVal.message
      return acc
    }, {}),
  }
}

const wrapperRequest = (fn: any) => {
  return async (req: Request, res: Response) => {
    try {
      const data = await fn({
        req,
        ResponseError,
      })

      return res.status(200).json(isObject(data) ? data : { data })
    } catch (e) {
      if (e instanceof ResponseError) {
        console.log('ERROR RESPONSE ERROR!!!')
        return res.status(e.statusCode).json(generateErrorResponseError(e))
      }

      if (e instanceof Sequelize.ValidationError) {
        console.log('ERROR SEQUELIZE VALIDATION!!!')
        return res.status(400).json(generateErrorSequelize(e))
      }
      /*
			 lebih logic return status code 500 karena error memang tidak dihandle
			 dicontroller
			 */
      return res.status(500).json({ message: e.message })
    }
  }
}

export default wrapperRequest
