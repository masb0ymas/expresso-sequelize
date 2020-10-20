/* eslint-disable no-unused-vars */
import createError from 'http-errors'
import express, { Request, Response, NextFunction } from 'express'
import path from 'path'
import cors from 'cors'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import indexRouter from 'routes'
import withState from 'helpers/withState'
import models from 'models/_instance'
import ExpressErrorYup from 'middlewares/ExpressErrorYup'
import ExpressErrorResponse from 'middlewares/ExpressErrorResponse'
import ExpressErrorSequelize from 'middlewares/ExpressErrorSequelize'

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
app.use(cookieParser())
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

app.use(ExpressErrorYup)
app.use(ExpressErrorSequelize)
app.use(ExpressErrorResponse)

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
