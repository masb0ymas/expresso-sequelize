import 'module-alias/register'
import './pathAlias'

import chalk from 'chalk'
import dotenv from 'dotenv'
import App from './app'
import initialAwsS3 from './config/clientS3'
import db from './database/models/_instance'
import initialJobs from './jobs'

dotenv.config()

const { AWS_ACCESS_KEY, AWS_SECRET_KEY } = process.env

const dialect = process.env.DB_CONNECTION ?? 'mysql'

const Server = new App()

// initial database
db.sequelize
  .authenticate()
  .then(() => {
    console.log(
      `Connection ${chalk.cyan(dialect)} has been established successfully.`
    )
  })
  .catch((err: any) => {
    console.error('Unable to connect to the database: ', err)
  })

// check if exist access & secret key aws
if (AWS_ACCESS_KEY && AWS_SECRET_KEY) {
  // initial client s3
  void initialAwsS3()
}

// initial jobs
initialJobs()

Server.run()
