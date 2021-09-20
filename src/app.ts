import i18next from '@config/i18nextConfig'
import winstonLogger, { winstonStream } from '@config/Logger'
import allowedOrigins from '@expresso/constants/ConstAllowedOrigins'
import withState from '@expresso/helpers/withState'
import ResponseError from '@expresso/modules/Response/ResponseError'
import { optionsSwaggerUI, swaggerSpec } from '@expresso/utils/DocsSwagger'
import ExpressAutoHandleTransaction from '@middlewares/ExpressAutoHandleTransaction'
import ExpressErrorResponse from '@middlewares/ExpressErrorResponse'
import ExpressErrorSequelize from '@middlewares/ExpressErrorSequelize'
import ExpressErrorYup from '@middlewares/ExpressErrorYup'
import ExpressRateLimit from '@middlewares/ExpressRateLimit'
import indexRoutes from '@routes/index'
import chalk from 'chalk'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import Cors from 'cors'
import dotenv from 'dotenv'
import Express, { Application, NextFunction, Request, Response } from 'express'
import UserAgent from 'express-useragent'
import Helmet from 'helmet'
import hpp from 'hpp'
import i18nextMiddleware from 'i18next-http-middleware'
import Logger from 'morgan'
import path from 'path'
import requestIp from 'request-ip'
import swaggerUI from 'swagger-ui-express'

dotenv.config()

const NODE_ENV = process.env.NODE_ENV ?? 'development'
const APP_PORT = Number(process.env.PORT) ?? 8000

const optCors: Cors.CorsOptions = {
  origin: allowedOrigins,
}

class App {
  private readonly application: Application
  private readonly port: number | string

  constructor() {
    this.port = APP_PORT
    this.application = Express()
    this.plugins()

    // docs swagger disable for production mode
    if (NODE_ENV !== 'production') {
      this.docsSwagger()
    }

    this.routes()
  }

  private plugins(): void {
    this.application.use(Helmet())
    this.application.use(Cors(optCors))
    this.application.use(Logger('combined', { stream: winstonStream }))
    this.application.use(Express.urlencoded({ extended: true }))
    this.application.use(
      Express.json({ limit: '200mb', type: 'application/json' })
    )
    this.application.use(cookieParser())
    this.application.use(compression())
    this.application.use(Express.static(path.resolve(`${__dirname}/../public`)))
    this.application.use(hpp())
    this.application.use(requestIp.mw())
    this.application.use(UserAgent.express())
    this.application.use(i18nextMiddleware.handle(i18next))
    this.application.use(ExpressRateLimit)
    this.application.use(function (
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      new withState(req)
      next()
    })
  }

  private docsSwagger(): void {
    this.application.get('/v1/api-docs.json', (req: Request, res: Response) => {
      res.setHeader('Content-Type', 'application/json')
      res.send(swaggerSpec)
    })

    this.application.use('/v1/api-docs', swaggerUI.serve)
    this.application.get(
      '/v1/api-docs',
      swaggerUI.setup(swaggerSpec, optionsSwaggerUI)
    )
  }

  private routes(): void {
    this.application.use(indexRoutes)

    // Catch error 404 endpoint not found
    this.application.use('*', function (req: Request, res: Response) {
      throw new ResponseError.NotFound(
        `Sorry, HTTP resource you are looking for was not found.`
      )
    })
  }

  public run(): void {
    // rollback transaction sequelize
    this.application.use(async function handleRollbackTransaction(
      err: any,
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> {
      try {
        await req.rollbackTransactions()
      } catch (err) {}

      next(err)
    })

    this.application.use(ExpressErrorYup)
    this.application.use(ExpressErrorSequelize)
    this.application.use(ExpressErrorResponse)
    this.application.use(ExpressAutoHandleTransaction)

    // Error handler
    this.application.use(function (err: any, req: Request, res: Response) {
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

    // Run listener
    this.application.listen(this.port, () => {
      const host = chalk.cyan(`http://localhost:${this.port}`)
      console.log(`Server listening on ${host} & Env: ${chalk.blue(NODE_ENV)}`)
    })
  }
}

export default App
