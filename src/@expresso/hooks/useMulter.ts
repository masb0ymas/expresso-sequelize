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

// extension
export const allowedZIP = ['.zip', '.7z']
export const allowedPDF = ['.pdf']
export const allowedImage = ['.png', '.jpg', '.jpeg', '.svg']
export const allowedExcel = ['.xlsx', '.xls']
export const allowedDoc = ['.doc', '.docx']

const defaultAllowedExt = [
  ...allowedZIP,
  ...allowedPDF,
  ...allowedImage,
  ...allowedExcel,
  ...allowedDoc,
]

// mimetype
export const allowedMimetypeZIP = [
  'application/zip',
  'application/x-zip-compressed',
  'application/x-7z-compressed',
]
export const allowedMimetypePDF = ['application/pdf']
export const allowedMimetypeImage = ['image/jpeg', 'image/png', 'image/svg+xml']
export const allowedMimetypeExcel = [
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]
export const allowedMimetypeDoc = [
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

const defaultAllowedMimetype = [
  ...allowedMimetypeZIP,
  ...allowedMimetypePDF,
  ...allowedMimetypeImage,
  ...allowedMimetypeExcel,
  ...allowedMimetypeDoc,
]

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
        return cb(
          new ResponseError.BadRequest(
            `Only ${allowedExt.join(', ')} ext are allowed`
          )
        )
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
