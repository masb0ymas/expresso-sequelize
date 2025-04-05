import { green } from 'colorette'
import { addDays } from 'date-fns'
import * as Minio from 'minio'
import { logger } from '~/config/logger'
import { ms } from '../date'
import { MinIOStorageParams, UploadFileParams } from './types'

export default class MinIOStorage {
  public client: Minio.Client
  private _access_key: string
  private _secret_key: string
  private _bucket: string
  private _expires: string
  private _region: string
  private _host: string
  private _port: number
  private _ssl: boolean

  constructor(params: MinIOStorageParams) {
    this._access_key = params.access_key
    this._secret_key = params.secret_key
    this._bucket = params.bucket
    this._expires = params.expires
    this._region = params.region
    this._host = params.host
    this._port = params.port
    this._ssl = params.ssl

    this.client = new Minio.Client({
      endPoint: this._host || '127.0.0.1',
      port: this._port || 9000,
      useSSL: this._ssl || false,
      accessKey: this._access_key,
      secretKey: this._secret_key,
    })
  }

  /**
   * Generate keyfile
   */
  private _generateKeyfile(values: string[]) {
    return values.join('/')
  }

  /**
   * Get expires object
   */
  public expiresObject() {
    const getExpired = this._expires.replace(/[^0-9]/g, '')

    const expiresIn = ms(this._expires)
    const expiryDate = addDays(new Date(), Number(getExpired))

    return { expiresIn, expiryDate }
  }

  /**
   * Initialize storage
   */
  async initialize() {
    const msgType = `${green('storage - minio')}`
    const bucketName = this._bucket

    const exists = await this.client.bucketExists(bucketName)

    if (!exists) {
      await this._createBucket()
    } else {
      const message = `${msgType} - ${bucketName} bucket found`
      logger.info(message)
    }
  }

  /**
   * Create bucket
   */
  private async _createBucket() {
    const msgType = `${green('storage - minio')}`
    const bucketName = this._bucket

    try {
      const data = await this.client.makeBucket(bucketName, this._region)

      const message = `${msgType} - ${bucketName} bucket created`
      logger.info(message)
      console.log(data)
    } catch (error: any) {
      const message = `${msgType} error: ${error.message ?? error}`
      logger.error(message)
      process.exit(1)
    }
  }

  /**
   * Upload file
   */
  async uploadFile({ directory, file }: UploadFileParams) {
    const keyfile = this._generateKeyfile([directory, file.filename])

    const options = {
      ContentType: file.mimetype, // <-- this is what you need!
      ContentDisposition: `inline; filename=${file.filename}`, // <-- and this !
      ACL: 'public-read', // <-- this makes it public so people can see it
    }

    const data = await this.client.fPutObject(this._bucket, keyfile, file.path, options)
    const signedUrl = await this.presignedUrl(keyfile)

    return { data, signedUrl }
  }

  /**
   * Generate presigned URL
   */
  async presignedUrl(keyfile: string) {
    const msgType = `${green('storage - minio')}`
    const bucketName = this._bucket

    const signedUrl = await this.client.presignedGetObject(bucketName, keyfile)

    const message = `${msgType} - ${keyfile} presigned URL generated`
    logger.info(message)

    return signedUrl
  }
}
