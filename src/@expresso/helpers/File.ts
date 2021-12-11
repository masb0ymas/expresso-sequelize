import chalk from 'chalk'
import fs from 'fs'
import _ from 'lodash'
import path from 'path'
import { logServer } from './Formatter'

/**
 *
 * @param filePath
 * @param callback
 */
export function readHTMLFile(filePath: string, callback: any): void {
  fs.readFile(filePath, { encoding: 'utf-8' }, function (err, html) {
    if (err) {
      callback(err)
    } else {
      callback(null, html)
    }
  })
}

/**
 *
 * @param outputPath
 * @param fileStream
 */
export function writeFileStream(outputPath: string, fileStream: Buffer): void {
  fs.writeFile(outputPath, fileStream, function (err) {
    if (err) return console.log(err)
    console.log(
      logServer('path stream', 'generate file successfully'),
      chalk.cyan(outputPath)
    )
  })
}

/**
 *
 * @param base64Data
 * @param filePath
 */
export function writeFileFromBase64(
  base64Data: string,
  filePath: string
): boolean {
  const bufferData = Buffer.from(base64Data, 'base64')

  if (fs.existsSync(path.resolve(filePath))) {
    console.log(logServer('file from base64', 'file exist, location... '), {
      filePath,
    })
    return true
  }

  console.log(
    logServer('file from base64', 'file not exist, creating file... '),
    { filePath }
  )
  fs.writeFileSync(filePath, bufferData)
  return false
}

/**
 *
 * @param pathDir
 */
export function createDirNotExist(pathDir: string): void {
  if (!fs.existsSync(path.resolve(pathDir))) {
    fs.mkdirSync(pathDir, { recursive: true })
    console.log(logServer('path', `created directory ${pathDir}`))
  }
}

/**
 *
 * @param filePath
 * @example
 * ```sh
 * public/uploads/images/logo.png
 * ```
 */
export function deleteFile(filePath: string): void {
  if (!_.isEmpty(filePath)) {
    // check file exsits or not
    if (fs.existsSync(path.resolve(filePath))) {
      // remove file
      console.log(logServer('delete file', `file ${filePath} has been deleted`))
      fs.unlinkSync(path.resolve(filePath))
    } else {
      console.log(logServer('delete file', `file ${filePath} not exist`))
    }
  }
}
