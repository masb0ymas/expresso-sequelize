/* eslint-disable @typescript-eslint/no-var-requires */
import { logServer } from '@expresso/helpers/Formatter'
import chalk from 'chalk'
import Express from 'express'
import fs from 'fs'
import path from 'path'

const route = Express.Router()

const baseRoutes = path.resolve(`${__dirname}/../controllers`)

/**
 * Get Routes
 * @param basePath
 */
const getRoutes = (basePath: string | Buffer): void => {
  const msgType = 'Route'
  // loop directory
  return fs.readdirSync(basePath).forEach((file) => {
    // read controller
    const getController = `${baseRoutes}/${file}/controller`

    // check dir controller exists
    if (!fs.existsSync(`${getController}.js`)) {
      const subDir = `${baseRoutes}/${file}`
      // loop sub directory
      fs.readdirSync(subDir).forEach((subFile) => {
        // read controller
        const getSubController = `${baseRoutes}/${file}/${subFile}/controller`

        // check sub dir controller exists
        if (fs.existsSync(`${getSubController}.js`)) {
          const routeSubDir = chalk.cyan(`${file}/${subFile}`)
          const message = `Controller ${routeSubDir} Registered`

          console.log(logServer(msgType, message))

          // require controller
          require(getSubController)
        }
      })
    } else {
      const routeDir = chalk.cyan(file)
      const message = `Controller ${routeDir} Registered`

      console.log(logServer(msgType, message))

      // require controller
      require(getController)
    }
  })
}

export default route

// Mapping Route
getRoutes(baseRoutes)
