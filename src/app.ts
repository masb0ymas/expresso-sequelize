import allowedOrigins from '@expresso/constants/ConstAllowedOrigins'
import withState from '@expresso/helpers/withState'
import bodyParser from 'body-parser'
import i18next from 'config/i18next'
import winstonLogger, { winstonStream } from 'config/winston'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import userAgent from 'express-useragent'
import helmet from 'helmet'
import hpp from 'hpp'
import createError from 'http-errors'
import i18nextMiddleware from 'i18next-http-middleware'
import initialJobs from 'jobs'
import ExpressAutoHandleTransaction from 'middlewares/ExpressAutoHandleTransaction'
import ExpressErrorResponse from 'middlewares/ExpressErrorResponse'
import ExpressErrorSequelize from 'middlewares/ExpressErrorSequelize'
import ExpressErrorYup from 'middlewares/ExpressErrorYup'
import ExpressRateLimit from 'middlewares/ExpressRateLimit'
import logger from 'morgan'
import path from 'path'
import requestIp from 'request-ip'
import indexRouter from 'routes'

const GenerateDoc = require('utils/GenerateDocs')

const { NODE_ENV } = process.env
const app = express()

const options: cors.CorsOptions = {
  origin: allowedOrigins,
}

// view engine setup
app.set('views', path.join(`${__dirname}/../`, 'views'))
app.set('view engine', 'pug')

app.use(helmet())
app.use(cors(options))
app.use(logger('combined', { stream: winstonStream }))
app.use(bodyParser.json({ limit: '100mb', type: 'application/json' }))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(`${__dirname}/../`, 'public')))
app.use(i18nextMiddleware.handle(i18next))

app.use(hpp())
app.use(userAgent.express())
app.use(requestIp.mw())
app.use(ExpressRateLimit)

app.use((req: Request, res, next) => {
  new withState(req)
  next()
})

// disable for production mode
if (NODE_ENV !== 'production') {
  // Initial Docs Swagger
  GenerateDoc(app)
}

// Initial Route
app.use(indexRouter)

// Initial Jobs
initialJobs()

async function handleRollbackTransaction(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await req.rollbackTransactions()
    // eslint-disable-next-line no-empty
  } catch (e) {}
  next(err)
}

app.use('/v1', handleRollbackTransaction)
app.use('/v1', ExpressErrorYup)
app.use('/v1', ExpressErrorSequelize)
app.use('/v1', ExpressErrorResponse)
app.use(ExpressAutoHandleTransaction)

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
  next(createError(404))
})

// error handler
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // add this line to include winston logging
  winstonLogger.error(
    `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
      req.method
    } - ${req.ip}`
  )

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
