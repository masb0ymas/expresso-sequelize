import fs from 'fs'
import _ from 'lodash'
import path from 'path'

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
    console.log('generate file successfully')
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
    console.log('file exist, location... ', filePath)
    return true
  }

  console.log('file not exist, creating file... ', filePath)
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
    console.log(`created directory ${pathDir}`)
  }
}

/**
 *
 * @param filePath
 */
export function deleteFile(filePath: String): void {
  if (!_.isEmpty(filePath)) {
    // check file exsits or not
    if (fs.existsSync(path.resolve(`public/${filePath}`))) {
      // remove file
      console.log(`file ${filePath} has been deleted`)
      fs.unlinkSync(path.resolve(`public/${filePath}`))
    } else {
      console.log(`file ${filePath} not exist`)
    }
  }
}
