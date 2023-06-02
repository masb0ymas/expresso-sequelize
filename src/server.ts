import 'module-alias/register'
import './pathAlias'

import chalk from 'chalk'
import { printLog } from 'expresso-core'
import {
  SEQUELIZE_CONNECTION,
  SEQUELIZE_DATABASE,
  SEQUELIZE_SYNC,
} from '~/config/env'
import db from '~/database/data-source'
import App from './app'

const server = new App()

// connect to database
db.sequelize
  .authenticate()
  .then(async () => {
    const dbDialect = chalk.cyan(SEQUELIZE_CONNECTION)
    const dbName = chalk.cyan(SEQUELIZE_DATABASE)

    const msgType = `Sequelize`
    const message = `Connection ${dbDialect}: ${dbName} has been established successfully.`

    const logMessage = printLog(msgType, message)
    console.log(logMessage)

    // not recommended when running in production mode
    if (SEQUELIZE_SYNC) {
      await db.sequelize.sync({ force: true })

      const logMessage = printLog(msgType, 'All Sync Database Successfully')
      console.log(logMessage)
    }

    // run the express app
    server.run()
  })
  .catch((err: any) => {
    const dbDialect = chalk.cyan(SEQUELIZE_CONNECTION)
    const dbName = chalk.cyan(SEQUELIZE_DATABASE)

    const errType = `Sequelize Error:`
    const message = `Unable to connect to the database ${dbDialect}: ${dbName}`

    const logMessage = printLog(errType, message)
    console.log(logMessage, err)
  })
