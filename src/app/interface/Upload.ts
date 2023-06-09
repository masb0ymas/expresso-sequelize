import { type FileAttributes } from 'expresso-provider/lib/interface'

export interface UploadFileEntity {
  fieldUpload: FileAttributes
  directory: string
  upload_id?: string | undefined
}
