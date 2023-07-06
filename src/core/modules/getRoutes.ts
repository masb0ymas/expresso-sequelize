import { green } from 'colorette'
import fs from 'fs'
import { logger } from '~/config/pino'
import { capitalizeFirstLetter } from '../utils/formatter'

/**
 * Get Controller from Route Path
 * @param controllerPath
 * @param filePath
 */
function _getController(controllerPath: string, filePath: string): void {
  if (fs.existsSync(controllerPath)) {
    const msgType = green('routes')

    const routeDir = green(filePath)
    const message = `controller ${routeDir} registered`

    logger.info(`${msgType} - ${message}`)

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
      const regexExt = /^.*\.(ts|js)$/
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
