import 'module-alias/register'
import './pathAlias'

import initialAwsS3 from '@config/clientS3'
import { AWS_ACCESS_KEY, AWS_SECRET_KEY, DB_CONNECTION } from '@config/env'
import db from '@database/models/_instance'
import { logErrServer, logServer } from '@expresso/helpers/Formatter'
import initialJobs from '@jobs/index'
import chalk from 'chalk'
import App from './app'

const Server = new App()

// initial database
db.sequelize
  .authenticate()
  .then(() => {
    const dbName = chalk.cyan(DB_CONNECTION)

    const msgType = `Sequelize`
    const message = `Connection ${dbName} has been established successfully.`

    console.log(logServer(msgType, message))
  })
  .catch((err: any) => {
    const dbName = chalk.cyan(DB_CONNECTION)

    const errType = `Sequelize Error:`
    const message = `Unable to connect to the database: ${dbName}`

    console.log(logErrServer(errType, message), err)
  })

// check if exist access & secret key aws
if (AWS_ACCESS_KEY && AWS_SECRET_KEY) {
  // initial client s3
  void initialAwsS3()
}

// initial firebase
// const serviceAccountKey = path.resolve('./serviceAccountKey.json')

// admin.initializeApp({ credential: admin.credential.cert(serviceAccountKey) })
// firebase.initializeApp(initialFirebase)

// initial jobs
initialJobs()

Server.run()
