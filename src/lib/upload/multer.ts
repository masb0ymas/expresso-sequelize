import { green } from 'colorette'
import { Request } from 'express'
import multer from 'multer'
import slugify from 'slugify'
import { logger } from '~/config/logger'
import { default_allowed_ext } from '../constant/upload/allowed-extension'
import { Mimetype } from '../constant/upload/allowed-mimetypes'
import { MulterConfig } from './types'

const mimetype = new Mimetype()

const default_field_size = 10 * 1024 * 1024 // 10mb
const default_file_size = 1 * 1024 * 1024 // 1mb
const default_destination = `${process.cwd()}/public/uploads/`

const msgType = `${green('multer')}`

export function useMulter(values: MulterConfig): multer.Multer {
  const destination = values.dest ?? default_destination
  const allowedMimetype = values.allowed_mimetype ?? mimetype.default
  const allowedExt = values.allowed_ext ?? default_allowed_ext

  const storage = multer.diskStorage({
    destination,
    filename: (_req: Request, file: Express.Multer.File, cb) => {
      const slugFilename = slugify(file.originalname, {
        replacement: '_',
        lower: true,
      })
      cb(null, `${Date.now()}-${slugFilename}`)
    },
  })

  return multer({
    storage,
    fileFilter: (_req, file, cb) => {
      const newMimetype = file.mimetype.toLowerCase()

      if (!allowedMimetype.includes(newMimetype)) {
        const extensions = allowedExt.join(', ')
        const errMessage = `Only ${extensions} extensions are allowed. Please check your file type.`
        logger.error(`${msgType} - ${errMessage}`)
        cb(new Error(errMessage))
        return
      }

      cb(null, true)
    },
    // @ts-expect-error
    limits: values.limit ?? {
      fieldSize: default_field_size,
      fileSize: default_file_size,
    },
  })
}
