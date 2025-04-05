import { green } from 'colorette'
import fs from 'fs'
import path from 'path'
import { logger } from '~/config/logger'

const msgType = `${green('filesystem')}`

/**
 * Delete a file from the filesystem
 */
export function deleteFile(filePath: string): void {
  const resolvedPath = path.resolve(filePath)

  if (fs.existsSync(resolvedPath)) {
    fs.unlinkSync(resolvedPath)
    logger.info(`${msgType} - Deleted file: ${resolvedPath}`)
  } else {
    logger.error(`${msgType} - File does not exist: ${resolvedPath}`)
  }
}
