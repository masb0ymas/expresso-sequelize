import 'module-alias/register'
import './pathAlias'

import { LOG_SERVER } from '@config/baseURL'
import initialAwsS3 from '@config/clientS3'
import db from '@database/models/_instance'
import initialJobs from '@jobs/index'
import chalk from 'chalk'
import dotenv from 'dotenv'
import App from './app'

dotenv.config()

const { AWS_ACCESS_KEY, AWS_SECRET_KEY } = process.env

const dialect = process.env.DB_CONNECTION ?? 'mysql'

const Server = new App()

// initial database
db.sequelize
  .authenticate()
  .then(() => {
    console.log(
      `${LOG_SERVER} Connection ${chalk.cyan(
        dialect
      )} has been established successfully.`
    )
  })
  .catch((err: any) => {
    console.error(`${LOG_SERVER} Unable to connect to the database: `, err)
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
