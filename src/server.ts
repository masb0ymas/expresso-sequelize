import 'module-alias/register'
import './pathAlias'

import initialAwsS3 from '@config/clientS3'
import { initialGCS } from '@config/googleCloudStorage'
import { logErrServer, logServer } from '@expresso/helpers/Formatter'
import chalk from 'chalk'
import App from './app'
import {
  AWS_ACCESS_KEY,
  AWS_SECRET_KEY,
  DB_CONNECTION,
  DB_DATABASE,
  DB_SYNC,
  GCP_PROJECT_ID,
} from './config/env'
import db from './database/data-source'
import initialJobs from './jobs'

const Server = new App()

db.sequelize
  .authenticate()
  .then(async () => {
    const dbDialect = chalk.cyan(DB_CONNECTION)
    const dbName = chalk.cyan(DB_DATABASE)

    const msgType = `Sequelize`
    const message = `Connection ${dbDialect}: ${dbName} has been established successfully.`

    console.log(logServer(msgType, message))

    // not recommended when running in production mode
    if (DB_SYNC) {
      await db.sequelize.sync({ force: true })
      console.log(logServer(msgType, 'All Sync Database Successfully'))
    }

    Server.run()
  })
  .catch((err: any) => {
    const dbDialect = chalk.cyan(DB_CONNECTION)
    const dbName = chalk.cyan(DB_DATABASE)

    const errType = `Sequelize Error:`
    const message = `Unable to connect to the database ${dbDialect}: ${dbName}`

    console.log(logErrServer(errType, message), err)
  })

// check if exist access & secret key aws
if (AWS_ACCESS_KEY && AWS_SECRET_KEY) {
  // initial client s3
  void initialAwsS3()
}

// check if exist gcp project id & bucket
if (GCP_PROJECT_ID) {
  // initial google cloud storage
  void initialGCS()
}

// initial jobs
initialJobs()
