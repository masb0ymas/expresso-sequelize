import { logServer } from '@expresso/helpers/Formatter'
import chalk from 'chalk'
import fs from 'fs'
import _ from 'lodash'

/**
 *
 * @param controllerPath
 * @param filePath
 */
function getController(controllerPath: string, filePath: string): void {
  // check file TS
  if (fs.existsSync(`${controllerPath}.ts`)) {
    const msgType = 'Route TS'

    const routeDir = chalk.cyan(filePath)
    const message = `Controller ${routeDir} Registered`

    console.log(logServer(msgType, message))

    // require controller
    require(controllerPath)
  }

  // check file JS
  if (fs.existsSync(`${controllerPath}.js`)) {
    const msgType = 'Route JS'

    const routeDir = chalk.cyan(filePath)
    const message = `Controller ${routeDir} Registered`

    console.log(logServer(msgType, message))

    // require controller
    require(controllerPath)
  }
}

/**
 * Get Routes
 * @param basePath
 */
export const getRoutes = (basePath: string | Buffer): void => {
  // loop main controller directory
  fs.readdirSync(basePath).forEach((file) => {
    const filePath = `${file}`

    const groupDir = `${basePath}/${file}`
    const controllerPath = `${groupDir}/controller`

    // @ts-expect-error
    const checkTS = basePath.match('src')

    // @ts-expect-error
    const checkJS = basePath.match('dist')

    // check TS file from src
    if (!_.isEmpty(checkTS)) {
      const controllerTSExist = fs.existsSync(`${controllerPath}.ts`)

      if (!controllerTSExist) {
        fs.readdirSync(groupDir).forEach((subFile) => {
          const subFilePath = `${file}/${subFile}`

          const subGroupDir = `${groupDir}/${subFile}`
          const subControllerPath = `${subGroupDir}/controller`

          const subControllerTSExist = fs.existsSync(`${subControllerPath}.ts`)

          if (!subControllerTSExist) {
            fs.readdirSync(subGroupDir).forEach((sub2File) => {
              const sub2FilePath = `${file}/${subFile}/${sub2File}`

              const sub2GroupDir = `${subGroupDir}/${sub2File}`
              const sub2ControllerPath = `${sub2GroupDir}/controller`

              getController(sub2ControllerPath, sub2FilePath)
            })
          }

          getController(subControllerPath, subFilePath)
        })
      }

      getController(controllerPath, filePath)
    }

    // check JS file from dist
    if (checkJS) {
      const controllerJSExist = fs.existsSync(`${controllerPath}.js`)

      if (!controllerJSExist) {
        fs.readdirSync(groupDir).forEach((subFile) => {
          const subFilePath = `${file}/${subFile}`

          const subGroupDir = `${groupDir}/${subFile}`
          const subControllerPath = `${subGroupDir}/controller`

          const subControllerJSExist = fs.existsSync(`${subControllerPath}.js`)

          if (!subControllerJSExist) {
            fs.readdirSync(subGroupDir).forEach((sub2File) => {
              const sub2FilePath = `${file}/${subFile}/${sub2File}`

              const sub2GroupDir = `${subGroupDir}/${sub2File}`
              const sub2ControllerPath = `${sub2GroupDir}/controller`

              getController(sub2ControllerPath, sub2FilePath)
            })
          }

          getController(subControllerPath, subFilePath)
        })
      }

      getController(controllerPath, filePath)
    }
  })
}
