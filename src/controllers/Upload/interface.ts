import { PutObjectCommandOutput } from '@aws-sdk/client-s3'
import Upload from '@database/entities/Upload'
import { FileAttributes } from '@expresso/interfaces/Files'
import { UploadResponse } from '@google-cloud/storage'

export interface UploadFileWithSignedURLEntity {
  fieldUpload: FileAttributes
  directory: string
  UploadId?: string | null
}

export interface DtoUploadS3WithSignedUrl {
  aws_s3_data: PutObjectCommandOutput
  upload_data: Upload
}

export interface DtoUploadGCSWithSignedUrl {
  gcs_data: UploadResponse
  upload_data: Upload
}
