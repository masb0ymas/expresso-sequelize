/* eslint-disable no-unused-vars */
import multer from 'multer'
import { Request } from 'express'

const storage = multer.diskStorage({
  destination: 'public/uploads/',
  filename(req: Request, file: Express.Multer.File, cb): void {
    cb(null, [Date.now(), file.originalname].join('-'))
  },
})

const ConfigMulter = multer({
  storage,
})

export default ConfigMulter
