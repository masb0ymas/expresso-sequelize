import {
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
  GetObjectCommand,
  PutObjectCommand,
  PutObjectCommandOutput,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { clientS3, s3ExpiresDate, s3ObjectExpired } from '@config/clientS3'
import { APP_LANG, AWS_BUCKET_NAME } from '@config/env'
import { i18nConfig } from '@config/i18nextConfig'
import Upload, { UploadAttributes } from '@database/entities/Upload'
import {
  logServer,
  validateBoolean,
  validateUUID,
} from '@expresso/helpers/Formatter'
import { optionsYup } from '@expresso/helpers/Validation'
import { FileAttributes } from '@expresso/interfaces/Files'
import { DtoFindAll } from '@expresso/interfaces/Paginate'
import { ReqOptions } from '@expresso/interfaces/ReqOptions'
import ResponseError from '@expresso/modules/Response/ResponseError'
import PluginSqlizeQuery from '@expresso/modules/SqlizeQuery/PluginSqlizeQuery'
import { endOfYesterday } from 'date-fns'
import { Request } from 'express'
import fs from 'fs'
import { TOptions } from 'i18next'
import _ from 'lodash'
import { Op } from 'sequelize'
import { validate as uuidValidate } from 'uuid'
import uploadSchema from './schema'

interface DtoUploadWithSignedUrlEntity {
  dataAwsS3: PutObjectCommandOutput
  resUpload: Upload
}

class UploadService {
  /**
   *
   * @param req
   * @returns
   */
  public static async findAll(req: Request): Promise<DtoFindAll<Upload>> {
    const { lang } = req.getQuery()

    const defaultLang = lang ?? APP_LANG
    const i18nOpt: string | TOptions = { lng: defaultLang }

    const { includeCount, order, ...queryFind } = PluginSqlizeQuery.generate(
      req.query,
      Upload,
      []
    )

    const data = await Upload.findAll({
      ...queryFind,
      order: order.length ? order : [['createdAt', 'desc']],
    })
    const total = await Upload.count({
      include: includeCount,
      where: queryFind.where,
    })

    const message = i18nConfig.t('success.data_received', i18nOpt)
    return { message: `${total} ${message}`, data, total }
  }

  /**
   *
   * @param id
   * @param options
   * @returns
   */
  public static async findById(
    id: string,
    options?: ReqOptions
  ): Promise<Upload> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    const newId = validateUUID(id, { ...options })
    const data = await Upload.findOne({
      where: { id: newId },
      paranoid: options?.isParanoid,
    })

    if (!data) {
      const message = i18nConfig.t('errors.not_found', i18nOpt)
      throw new ResponseError.NotFound(`upload ${message}`)
    }

    return data
  }

  /**
   *
   * @param formData
   * @returns
   */
  public static async create(formData: UploadAttributes): Promise<Upload> {
    const value = uploadSchema.create.validateSync(formData, optionsYup)

    const data = await Upload.create(value)

    return data
  }

  /**
   *
   * @param id
   * @param formData
   * @param options
   * @returns
   */
  public static async update(
    id: string,
    formData: Partial<UploadAttributes>,
    options?: ReqOptions
  ): Promise<Upload> {
    const data = await this.findById(id, { ...options })

    const value = uploadSchema.create.validateSync(
      { ...data, ...formData },
      optionsYup
    )

    const newData = await data.update({ ...data, ...value })

    return newData
  }

  /**
   *
   * @param keyFile
   * @returns
   */
  public static async deleteObjectS3(
    keyFile: string
  ): Promise<DeleteObjectCommandOutput> {
    const dataAwsS3 = await clientS3.send(
      new DeleteObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: keyFile,
      })
    )

    console.log(logServer('Aws S3 : ', 'Success. Object deleted.'), dataAwsS3)

    return dataAwsS3
  }

  /**
   *
   * @param id
   * @param options
   */
  public static async restore(id: string, options?: ReqOptions): Promise<void> {
    const data = await this.findById(id, { isParanoid: false, ...options })
    await data.restore()
  }

  /**
   *
   * @param id
   * @param options
   */
  private static async delete(id: string, options?: ReqOptions): Promise<void> {
    // if true = force delete else soft delete
    const isForce = validateBoolean(options?.isForce)

    const data = await this.findById(id, { ...options })
    await data.destroy({ force: isForce })
  }

  /**
   *
   * @param id
   * @param options
   */
  public static async softDelete(
    id: string,
    options?: ReqOptions
  ): Promise<void> {
    // soft delete
    await this.delete(id, options)
  }

  /**
   *
   * @param id
   * @param options
   */
  public static async forceDelete(
    id: string,
    options?: ReqOptions
  ): Promise<void> {
    const data = await this.findById(id, { ...options })

    // delete file from aws s3
    await this.deleteObjectS3(data.keyFile)

    // force delete
    await this.delete(id, { isForce: true, ...options })
  }

  /**
   *
   * @param ids
   * @param options
   */
  private static validateIds(ids: string[], options?: ReqOptions): void {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    if (_.isEmpty(ids)) {
      const message = i18nConfig.t('errors.cant_be_empty', i18nOpt)
      throw new ResponseError.BadRequest(`ids ${message}`)
    }
  }

  /**
   *
   * @param ids
   * @param options
   */
  public static async multipleRestore(
    ids: string[],
    options?: ReqOptions
  ): Promise<void> {
    // validate empty ids
    this.validateIds(ids, options)

    await Upload.restore({
      where: { id: { [Op.in]: ids } },
    })
  }

  /**
   *
   * @param ids
   * @param options
   */
  private static async multipleDelete(
    ids: string[],
    options?: ReqOptions
  ): Promise<void> {
    // validate empty ids
    this.validateIds(ids, options)

    // if true = force delete else soft delete
    const isForce = validateBoolean(options?.isForce)

    await Upload.destroy({
      where: { id: { [Op.in]: ids } },
      force: isForce,
    })
  }

  /**
   *
   * @param ids
   * @param options
   */
  public static async multipleSoftDelete(
    ids: string[],
    options?: ReqOptions
  ): Promise<void> {
    // multiple soft delete
    await this.multipleDelete(ids, options)
  }

  /**
   *
   * @param ids
   * @param options
   */
  public static async multipleForceDelete(
    ids: string[],
    options?: ReqOptions
  ): Promise<void> {
    const getUploads = await Upload.findAll({ where: { id: { [Op.in]: ids } } })

    if (!_.isEmpty(getUploads)) {
      for (let i = 0; i < getUploads.length; i += 1) {
        const item = getUploads[i]

        // delete file from aws s3
        await this.deleteObjectS3(item.keyFile)
      }
    }

    // multiple force delete
    await this.multipleDelete(ids, { isForce: true, ...options })
  }

  /**
   *
   * @param keyFile
   * @returns
   */
  public static async getSignedUrlS3(keyFile: string): Promise<string> {
    // signed url from bucket S3
    const command = new GetObjectCommand({
      Bucket: AWS_BUCKET_NAME,
      Key: keyFile,
    })
    const signedUrl = await getSignedUrl(clientS3, command, {
      expiresIn: s3ObjectExpired,
    })

    return signedUrl
  }

  /**
   *
   * @param fieldUpload
   * @param directory
   * @param UploadId
   * @returns
   */
  public static async uploadFileWithSignedUrl(
    fieldUpload: FileAttributes,
    directory: string,
    UploadId?: string | null
  ): Promise<DtoUploadWithSignedUrlEntity> {
    let resUpload

    const keyFile = `${directory}/${fieldUpload.filename}`

    // send file upload to AWS S3
    const dataAwsS3 = await clientS3.send(
      new PutObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: keyFile,
        Body: fs.createReadStream(fieldUpload.path),
        ContentType: fieldUpload.mimetype, // <-- this is what you need!
        ContentDisposition: `inline; filename=${fieldUpload.filename}`, // <-- and this !
        ACL: 'public-read', // <-- this makes it public so people can see it
      })
    )

    // const sevenDays = 24 * 7
    // const expiresIn = sevenDays * 60 * 60

    // signed url from bucket S3
    const signedURL = await this.getSignedUrlS3(keyFile)

    const formUpload = {
      ...fieldUpload,
      keyFile,
      signedURL,
      expiryDateURL: s3ExpiresDate,
    }

    // check uuid
    if (!_.isEmpty(UploadId) && uuidValidate(String(UploadId))) {
      // find upload
      const getUpload = await Upload.findOne({
        where: { id: String(UploadId) },
      })

      // update file upload
      if (getUpload) {
        resUpload = await getUpload.update(formUpload)
      } else {
        // create new file
        resUpload = await this.create(formUpload)
      }
    } else {
      // create new file
      resUpload = await this.create(formUpload)
    }

    return { dataAwsS3, resUpload }
  }

  /**
   * Update Signed URL Aws S3
   */
  public static async updateSignedUrl(): Promise<void> {
    const getUploads = await Upload.findAll({
      where: { expiryDateURL: { [Op.lt]: endOfYesterday() } },
    })

    const chunkUploads = _.chunk(getUploads, 50)

    // chunk uploads data
    if (!_.isEmpty(chunkUploads)) {
      for (let i = 0; i < chunkUploads.length; i += 1) {
        const itemUploads = chunkUploads[i]

        // check uploads
        if (!_.isEmpty(itemUploads)) {
          for (let i = 0; i < itemUploads.length; i += 1) {
            const item = itemUploads[i]

            const signedURL = await this.getSignedUrlS3(item.keyFile)

            const formUpload = { signedURL, expiryDateURL: s3ExpiresDate }

            // update signed url & expires url
            await item.update(formUpload)
          }
        }
      }
    }
  }
}

export default UploadService
