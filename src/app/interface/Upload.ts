import { FileAttributes } from 'expresso-provider/lib/storage/types'

export interface UploadFileEntity {
  fieldUpload: FileAttributes
  directory: string
  upload_id?: string | undefined
}
