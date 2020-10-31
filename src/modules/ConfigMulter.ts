/* eslint-disable no-unused-vars */
import multer from 'multer'
import { Request, Express } from 'express'

const multerSetup = (dest?: string) => {
  const storage = multer.diskStorage({
    destination: dest || 'public/uploads/',
    filename(req: Request, file: Express.Multer.File, cb): void {
      cb(null, [Date.now(), file.originalname].join('-'))
    },
  })

  const ConfigMulter = multer({
    storage,
  })

  return ConfigMulter
}

export default multerSetup
