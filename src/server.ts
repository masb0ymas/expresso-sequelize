import 'module-alias/register'
import './pathAlias'

import chalk from 'chalk'
import dotenv from 'dotenv'
import App from './app'
import initialJobs from './jobs'
import db from './models/_instance'

dotenv.config()

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

// initial jobs
initialJobs()

Server.run()
