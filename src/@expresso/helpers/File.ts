import fs from 'fs'
import { isEmpty } from 'lodash'
import path from 'path'

/**
 *
 * @param filePath
 * @param callback
 */
function readHTMLFile(filePath: string, callback: any) {
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
function writeFileStream(outputPath: string, fileStream: Buffer) {
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
function writeFileFromBase64(base64Data: string, filePath: string) {
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
 * @param filePath
 */
function deleteFile(filePath: String) {
  if (!isEmpty(filePath)) {
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

export { readHTMLFile, writeFileFromBase64, writeFileStream, deleteFile }
