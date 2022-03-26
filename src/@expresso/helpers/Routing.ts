import { logServer } from '@expresso/helpers/Formatter'
import chalk from 'chalk'
import fs from 'fs'

/**
 * Get Routes
 * @param basePath
 */
export const getRoutes = (basePath: string | Buffer): void => {
  const msgType = 'Route'
  // loop directory
  return fs.readdirSync(basePath).forEach((file) => {
    // read controller
    const getController = `${basePath}/${file}/controller`

    // check dir controller exists
    if (!fs.existsSync(`${getController}.js`)) {
      const subDir = `${basePath}/${file}`
      // loop sub directory
      fs.readdirSync(subDir).forEach((subFile) => {
        // read controller
        const getSubController = `${basePath}/${file}/${subFile}/controller`

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
