import { defaultAllowedExt } from '@expresso/constants/ConstExt'
import { defaultAllowedMimetype } from '@expresso/constants/ConstMimetype'
import { createDirNotExist } from '@expresso/helpers/File'
import ResponseError from '@expresso/modules/Response/ResponseError'
import { Request } from 'express'
import multer from 'multer'
import slugify from 'slugify'

interface MulterSetupProps {
  dest?: string
  allowedExt?: string[]
  allowedMimetype?: string[]
  limit?: {
    fieldSize?: number
    fileSize?: number
  }
}

const defaultFieldSize = 10 * 1024 * 1024 // 10mb
const defaultFileSize = 1 * 1024 * 1024 // 1mb
const defaultDestination = 'public/uploads/'

const useMulter = (props: MulterSetupProps): multer.Multer => {
  // always check destination
  const destination = props.dest ?? defaultDestination
  createDirNotExist(destination)

  // config storage
  const storage = multer.diskStorage({
    destination,
    filename(req: Request, file: Express.Multer.File, cb): void {
      const slugFilename = slugify(file.originalname, {
        replacement: '_',
        lower: true,
      })
      cb(null, [Date.now(), slugFilename].join('-'))
    },
  })

  // config multer upload
  const configMulter = multer({
    storage,
    fileFilter(req, file, cb) {
      const allowedMimetype = props.allowedMimetype ?? defaultAllowedMimetype
      const allowedExt = props.allowedExt ?? defaultAllowedExt
      const mimetype = file.mimetype.toLowerCase()

      console.log({ mimetype })

      if (!allowedMimetype.includes(mimetype)) {
        const getExtension = allowedExt.join(', ') // .png, .jpg, .pdf
        const message = `Only ${getExtension} ext are allowed, please check your mimetype file`

        cb(new ResponseError.BadRequest(message))
        return
      }

      cb(null, true)
    },
    limits: props.limit ?? {
      fieldSize: defaultFieldSize,
      fileSize: defaultFileSize,
    },
  })

  return configMulter
}

export default useMulter
