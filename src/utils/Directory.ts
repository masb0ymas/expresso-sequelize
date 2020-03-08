import fs from 'fs'
import path from 'path'

const createDirNotExist = (pathDir: string) => {
  if (!fs.existsSync(path.resolve(pathDir))) {
    fs.mkdirSync(pathDir, { recursive: true })
    console.log(`created directory ${pathDir}`)
  }
}

export default createDirNotExist
