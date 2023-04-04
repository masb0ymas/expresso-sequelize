import { type FileAttributes } from 'expresso-provider/lib/interface'

export interface UploadFileEntity {
  fieldUpload: FileAttributes
  directory: string
  UploadId?: string | undefined
}
