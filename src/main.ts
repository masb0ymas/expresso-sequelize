import { blue, green } from 'colorette'
import { logger } from 'expresso-core'
import http from 'http'
import { App } from './config/app'
import { env } from './config/env'
import { httpHandle } from './core/modules/http/handle'
import db from './database/datasource'

function bootstrap(): void {
  const port = env.APP_PORT

  // create express app
  const app = new App().create()

  const server = http.createServer(app)

  // http handle
  const { onError, onListening } = httpHandle(server, port)

  const dbDialect = blue(env.SEQUELIZE_CONNECTION)
  const dbName = blue(env.SEQUELIZE_DATABASE)

  // connect to database
  db.sequelize
    .authenticate()
    .then(async () => {
      const msgType = green(`sequelize`)
      const message = `connection ${dbDialect}: ${dbName} has been established successfully.`

      logger.info(`${msgType} - ${message}`)

      // not recommended when running in production mode
      if (env.SEQUELIZE_SYNC) {
        await db.sequelize.sync({ force: true })

        logger.info(`${msgType} - all sync database successfully`)
      }

      // run server listen
      server.listen(port)
      server.on('error', onError)
      server.on('listening', onListening)
    })
    .catch((err: any) => {
      const errType = `sequelize error:`
      const message = `unable to connect to the database ${dbDialect}: ${dbName}`
      console.log(err)

      logger.error(`${errType} - ${message}`)
      process.exit(1)
    })
}

bootstrap()
