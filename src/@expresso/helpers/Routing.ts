import { logServer } from '@expresso/helpers/Formatter'
import chalk from 'chalk'
import fs from 'fs'

/**
 * Get Routes
 * @param basePath
 */
export const getRoutes = (basePath: string | Buffer): void => {
  const msgType = 'Route'
  // loop main controller directory
  return fs.readdirSync(basePath).forEach((file) => {
    // read controller on main controller directory
    const getController = `${basePath}/${file}/controller`

    // check sub dir controller exists
    if (!fs.existsSync(`${getController}.js`)) {
      const subDir = `${basePath}/${file}`

      // loop sub directory controller
      fs.readdirSync(subDir).forEach((subFile) => {
        // read controller
        const getSubController = `${subDir}/${subFile}/controller`

        // check sub-sub dir controller exists
        if (!fs.existsSync(`${getSubController}.js`)) {
          const sub2Dir = `${basePath}/${file}/${subFile}`

          // loop sub directory
          fs.readdirSync(sub2Dir).forEach((sub2File) => {
            // read controller
            const getSub2Controller = `${sub2Dir}/${sub2File}/controller`

            // check sub dir controller exists
            if (fs.existsSync(`${getSub2Controller}.js`)) {
              const routeSub2Dir = chalk.cyan(`${file}/${subFile}/${sub2File}`)
              const message = `Controller ${routeSub2Dir} Registered`

              console.log(logServer(msgType, message))

              // require controller
              require(getSub2Controller)
            }
          })
        }

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
