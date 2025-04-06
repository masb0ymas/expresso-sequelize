import { green } from 'colorette'
import fs from 'fs'
import * as fsAsync from 'fs/promises'
import { logger } from '~/config/logger'

const msgType = `${green('filesystem')}`

/**
 * Read HTML file
 * @param filePath - path to HTML file
 * @returns HTML file content
 */
export async function readHTMLFile(
  filePath: fs.PathLike | fs.promises.FileHandle
): Promise<string> {
  try {
    return await fsAsync.readFile(filePath, 'utf-8')
  } catch (err) {
    logger.error(`${msgType} - invalid HTML file path: ${filePath}`)
    throw new Error(`invalid HTML file path: ${filePath}`)
  }
}
