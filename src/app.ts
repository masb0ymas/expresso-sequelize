import chalk from 'chalk'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import Express, { type Application, type Request, type Response } from 'express'
import userAgent from 'express-useragent'
import { printLog } from 'expresso-core'
import helmet from 'helmet'
import hpp from 'hpp'
import http from 'http'
import i18nextMiddleware from 'i18next-http-middleware'
import logger from 'morgan'
import path from 'path'
import requestIp from 'request-ip'
import swaggerUI from 'swagger-ui-express'
import { Jobs } from '~/apps/jobs'
import expressErrorResponse from '~/apps/middlewares/expressErrorResponse'
import expressErrorSequelize from '~/apps/middlewares/expressErrorSequelize'
import expressErrorYup from '~/apps/middlewares/expressErrorYups'
import { expressRateLimit } from '~/apps/middlewares/expressRateLimit'
import { expressWithState } from '~/apps/middlewares/expressWithState'
import { expressUserAgent } from '~/apps/middlewares/userAgent'
import {
  APP_NAME,
  APP_PORT,
  MAIL_PASSWORD,
  MAIL_USERNAME,
  NODE_ENV,
} from '~/config/env'
import { i18nConfig } from '~/config/i18n'
import { winstonLogger, winstonStream } from '~/config/logger'
import { mailService } from '~/config/mail'
import { storageService } from '~/config/storage'
import allowedOrigins from '~/core/constants/allowedOrigins'
import { optionsSwaggerUI, swaggerSpec } from '~/core/helpers/docsSwagger'
import ResponseError from '~/core/modules/response/ResponseError'
import indexRoutes from './routes'

const optCors: cors.CorsOptions = {
  origin: allowedOrigins,
}

class App {
  private readonly _application: Application
  private readonly _port: number | string

  constructor() {
    this._application = Express()
    this._port = APP_PORT

    // enabled
    this._plugins()
    this._initializeProvider()

    // docs swagger disable for production mode
    if (NODE_ENV !== 'production') {
      this._docsSwagger()
    }

    this._routes()
  }

  /**
   * Express Plugins
   */
  private _plugins(): void {
    this._application.use(helmet())
    this._application.use(cors(optCors))
    this._application.use(logger('combined', { stream: winstonStream }))
    this._application.use(
      Express.json({ limit: '200mb', type: 'application/json' })
    )
    this._application.use(Express.urlencoded({ extended: true }))
    this._application.use(cookieParser())
    this._application.use(compression())
    this._application.use(
      Express.static(path.resolve(`${__dirname}/../public`))
    )
    this._application.use(hpp())
    this._application.use(requestIp.mw())
    this._application.use(userAgent.express())
    this._application.use(i18nextMiddleware.handle(i18nConfig))
    this._application.use(expressRateLimit())
    this._application.use(expressWithState())
    this._application.use(expressUserAgent())
  }

  /**
   * Initialize Service Provider
   */
  private _initializeProvider(): void {
    // initialize storage service
    void storageService.initialize()

    // initialize mail service
    if (MAIL_USERNAME && MAIL_PASSWORD) {
      mailService.initialize()
    }

    // initialize jobs
    Jobs.initialize()
  }

  /**
   * Docs Swaggers
   */
  private _docsSwagger(): void {
    this._application.get(
      '/v1/api-docs.json',
      (req: Request, res: Response) => {
        res.setHeader('Content-Type', 'application/json')
        res.send(swaggerSpec)
      }
    )

    this._application.use('/v1/api-docs', swaggerUI.serve)
    this._application.get(
      '/v1/api-docs',
      swaggerUI.setup(swaggerSpec, optionsSwaggerUI)
    )
  }

  /**
   * Setup Routes
   */
  private _routes(): void {
    this._application.use(indexRoutes)

    // Catch error 404 endpoint not found
    this._application.use('*', function (req: Request, _res: Response) {
      const method = req.method
      const url = req.originalUrl
      const host = req.hostname

      const endpoint = `${host}${url}`

      throw new ResponseError.NotFound(
        `Sorry, the ${endpoint} HTTP method ${method} resource you are looking for was not found.`
      )
    })
  }

  /**
   * Return Application Config
   * @returns
   */
  public app(): Application {
    return this._application
  }

  /**
   * Run Express App
   */
  public run(): void {
    this._application.use(expressErrorYup)
    this._application.use(expressErrorSequelize)
    this._application.use(expressErrorResponse)

    // Error handler
    this._application.use(function (err: any, req: Request, res: Response) {
      // Set locals, only providing error in development
      res.locals.message = err.message
      res.locals.error = req.app.get('env') === 'development' ? err : {}

      // Add this line to include winston logging
      winstonLogger.error(
        `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
          req.method
        } - ${req.ip}`
      )

      // Render the error page
      res.status(err.status || 500)
      res.render('error')
    })

    // setup port
    this._application.set('port', this._port)
    const server = http.createServer(this._application)

    const onError = (error: { syscall: string; code: string }): void => {
      if (error.syscall !== 'listen') {
        throw new Error()
      }

      const bind =
        typeof this._port === 'string'
          ? `Pipe ${this._port}`
          : `Port ${this._port}`

      // handle specific listen errors with friendly messages
      switch (error.code) {
        case 'EACCES':
          console.error(`${bind} requires elevated privileges`)
          process.exit(1)
          break
        case 'EADDRINUSE':
          console.error(`${bind} is already in use`)
          process.exit(1)
          break
        default:
          throw new Error()
      }
    }

    const onListening = (): void => {
      const addr = server.address()
      const bind = typeof addr === 'string' ? `${addr}` : `${addr?.port}`

      const host = chalk.cyan(`http://localhost:${bind}`)
      const env = chalk.blue(NODE_ENV)

      const msgType = `${APP_NAME}`
      const message = `Server listening on ${host} ⚡️ & Env: ${env} 🚀`

      const logMessage = printLog(msgType, message)
      console.log(logMessage)
    }

    // Run listener
    server.listen(this._port)
    server.on('error', onError)
    server.on('listening', onListening)
  }
}

export default App
