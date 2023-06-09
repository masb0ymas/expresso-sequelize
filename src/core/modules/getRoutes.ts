import chalk from 'chalk'
import { printLog } from 'expresso-core'
import fs from 'fs'
import { capitalizeFirstLetter } from '../utils/formatter'

/**
 * Get Controller from Route Path
 * @param controllerPath
 * @param filePath
 */
function _getController(controllerPath: string, filePath: string): void {
  if (fs.existsSync(controllerPath)) {
    const msgType = 'Routes'

    const routeDir = chalk.cyan(filePath)
    const message = `Controller ${routeDir} Registered`

    const logMessage = printLog(msgType, message)

    console.log(logMessage)

    // require controller
    require(controllerPath)
  }
}

/**
 * Get Routes
 * @param basePath
 */
export const getRoutes = (basePath: string): void => {
  const checkTS = basePath.match('src')
  const checkJS = basePath.match('dist')

  if (checkTS ?? checkJS) {
    // loop main controller directory
    fs.readdirSync(basePath).forEach((file) => {
      const regexExt = /.ts|.js/
      const matchFile = file.match(regexExt)

      const controllerPath = `${basePath}/${file}`
      const controllerExist = fs.existsSync(controllerPath)

      if (matchFile) {
        const splitFilename = file.split('.')
        const filename = capitalizeFirstLetter(splitFilename[0])

        _getController(controllerPath, filename)
      }

      if (!matchFile || !controllerExist) {
        getRoutes(controllerPath)
      }
    })
  }
}
