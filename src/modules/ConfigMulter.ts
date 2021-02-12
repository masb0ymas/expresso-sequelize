import multer from 'multer'
import path from 'path'
import { Request, Express } from 'express'
import slugify from 'slugify'
import ResponseError from './Response/ResponseError'

interface MulterSetupProps {
  dest?: string
  allowedExt?: string[]
  limit?: {
    fieldSize?: number
    fileSize?: number
  }
}

const defaultFieldSize = 10 * 1024 * 1024 // 10mb
const defaultFileSize = 1 * 1024 * 1024 // 1mb
const defaultDestination = 'public/uploads/'
const defaultAllowedExt = ['.png', '.jpg', '.jpeg', '.xlsx', '.xls', '.pdf']

const multerSetup = (props: MulterSetupProps) => {
  // config storage
  const storage = multer.diskStorage({
    destination: props.dest || defaultDestination,
    filename(req: Request, file: Express.Multer.File, cb): void {
      const slugFilename = slugify(file.originalname, {
        replacement: '_',
        lower: true,
      })
      cb(null, [Date.now(), slugFilename].join('-'))
    },
  })

  // config multer upload
  const ConfigMulter = multer({
    storage,
    fileFilter(req, file, cb) {
      const ext = path.extname(file.originalname)
      const allowedExt = props.allowedExt || defaultAllowedExt

      if (!allowedExt.includes(ext.toLowerCase())) {
        return cb(
          new ResponseError.BadRequest(
            `Only ${allowedExt.join(', ')} ext are allowed`
          )
        )
      }

      cb(null, true)
    },
    limits: props.limit || {
      fieldSize: defaultFieldSize,
      fileSize: defaultFileSize,
    },
  })

  return ConfigMulter
}

export default multerSetup
