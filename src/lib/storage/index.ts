import GoogleCloudStorage from './gcs'
import MinIOStorage from './minio'
import S3Storage from './s3'
import { StorageInstance, StorageParams } from './types'

export default class Storage {
  static create({ storageType, params }: StorageParams): StorageInstance {
    switch (storageType) {
      case 's3':
        // @ts-expect-error
        return new S3Storage(params)

      case 'minio':
        // @ts-expect-error
        return new MinIOStorage(params)

      case 'gcs':
        // @ts-expect-error
        return new GoogleCloudStorage(params)

      default:
        throw new Error('Invalid storage type')
    }
  }
}
