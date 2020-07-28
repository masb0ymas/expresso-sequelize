/* eslint-disable no-unused-vars */
import createError from 'http-errors'
import express, { Request, Response, NextFunction } from 'express'
import path from 'path'
import cors from 'cors'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import * as yup from 'yup'
import { get, isObject } from 'lodash'
import Sequelize from 'sequelize'
import indexRouter from 'routes'
import withState from 'helpers/withState'
import models from 'models/_instance'
import ResponseError from 'modules/ResponseError'

const GenerateDoc = require('utils/GenerateDocs')
const logger = require('morgan')

const app = express()

// view engine setup
app.set('views', path.join(`${__dirname}/../`, 'views'))
app.set('view engine', 'pug')

app.use(helmet())
app.use(cors())
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(`${__dirname}/../`, 'public')))

app.use((req: Request, res, next) => {
  new withState(req)
  next()
})

// Initial Docs Swagger
GenerateDoc(app)

// Initial DB
models.sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch((err: any) => {
    console.error('Unable to connect to the database:', err)
  })

// Initial Route
app.use(indexRouter)

function generateErrorResponseError(e: Error) {
  return isObject(e.message) ? e.message : { message: e.message }
}

app.use('/v1', async function (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  await req.rollbackTransactions()

  if (err instanceof ResponseError.BaseResponse) {
    return res.status(err.statusCode).json(generateErrorResponseError(err))
  }

  if (err instanceof yup.ValidationError) {
    console.log('ERROR YUP VALIDATION!!!')
    const error = {
      message: err.errors.join('<br/>') || 'Yup Validation Error !',
      errors:
        err.inner.length > 0
          ? err.inner.reduce((acc: any, curVal: any) => {
              acc[`${curVal.path}`] = curVal.message || curVal.type
              return acc
            }, {})
          : { [`${err.path}`]: err.message || err.type },
    }
    return res.status(422).json(error)
  }

  if (err instanceof Sequelize.ValidationError) {
    console.log('ERROR SEQUELIZE VALIDATION!!!')
    const errors: any[] = get(err, 'errors', [])
    const errorMessage = get(errors, '0.message', null)

    const dataError = {
      message: errorMessage ? `Validation error: ${errorMessage}` : err.message,
      errors: errors.reduce<any>((acc, curVal) => {
        acc[curVal.path] = curVal.message
        return acc
      }, {}),
    }

    console.log(dataError.message, dataError.errors)

    return res.status(400).json(dataError)
  }

  next(err)
})

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
  next(createError(404))
})

// error handler
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
