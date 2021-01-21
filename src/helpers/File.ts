import fs from 'fs'
import path from 'path'

/**
 *
 * @param path - path file template html
 * @param callback
 */
function readHTMLFile(path: any, callback: any) {
  fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
    if (err) {
      callback(err)
    } else {
      callback(null, html)
    }
  })
}

/**
 *
 * @param base64Data
 * @param pathFile
 */
function writeFileFromBase64(base64Data: string, pathFile: string) {
  const bufferData = Buffer.from(base64Data, 'base64')

  if (fs.existsSync(path.resolve(pathFile))) {
    console.log('file exist, location... ', pathFile)
    return true
  }

  console.log('file not exist, creating file... ', pathFile)
  fs.writeFileSync(pathFile, bufferData)
  return false
}

export { readHTMLFile, writeFileFromBase64 }
