import {
  GetObjectCommand,
  PutObjectCommand,
  PutObjectCommandOutput,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { clientS3, s3ExpiresDate, s3ObjectExpired } from '@config/clientS3'
import { APP_LANG, AWS_BUCKET_NAME } from '@config/env'
import { i18nConfig } from '@config/i18nextConfig'
import models from '@database/models/index'
import { UploadAttributes, UploadInstance } from '@database/models/upload'
import db from '@database/models/_instance'
import { validateBoolean, validateUUID } from '@expresso/helpers/Formatter'
import useValidation from '@expresso/hooks/useValidation'
import { FileAttributes } from '@expresso/interfaces/Files'
import ResponseError from '@expresso/modules/Response/ResponseError'
import {
  DtoFindAll,
  SqlizeOptions,
} from '@expresso/modules/SqlizeQuery/interface'
import PluginSqlizeQuery from '@expresso/modules/SqlizeQuery/PluginSqlizeQuery'
import { endOfYesterday } from 'date-fns'
import { Request } from 'express'
import fs from 'fs'
import { TOptions } from 'i18next'
import _ from 'lodash'
import { validate as uuidValidate } from 'uuid'
import uploadSchema from './schema'

const { Sequelize } = db
const { Op } = Sequelize
const { Upload } = models

interface DtoPaginate extends DtoFindAll {
  data: UploadInstance[]
}

class UploadService {
  /**
   *
   * @param req
   * @returns
   */
  public static async findAll(req: Request): Promise<DtoPaginate> {
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

    const message = i18nConfig.t('success.dataReceived', i18nOpt)
    return { message: `${total} ${message}`, data, total }
  }

  /**
   *
   * @param id
   * @param options
   * @returns
   */
  public static async findByPk(
    id: string,
    options?: SqlizeOptions
  ): Promise<UploadInstance> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    const newId = validateUUID(id, { lang: options?.lang })
    const data = await Upload.findByPk(newId, {
      include: options?.include,
      order: options?.order,
      paranoid: options?.paranoid,
    })

    if (!data) {
      const message = i18nConfig.t('errors.notFound', i18nOpt)
      throw new ResponseError.NotFound(`upload ${message}`)
    }

    return data
  }

  /**
   *
   * @param id
   * @param options
   * @returns
   */
  public static async findById(
    id: string,
    options?: SqlizeOptions
  ): Promise<UploadInstance> {
    const data = await this.findByPk(id, { ...options })

    return data
  }

  /**
   *
   * @param formData
   * @param options
   * @returns
   */
  public static async create(
    formData: UploadAttributes,
    options?: SqlizeOptions
  ): Promise<UploadInstance> {
    const value = useValidation(uploadSchema.create, formData)
    const data = await Upload.create(value, {
      transaction: options?.transaction,
    })

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
    options?: SqlizeOptions
  ): Promise<UploadInstance> {
    const data = await this.findByPk(id, { lang: options?.lang })

    const value = useValidation(uploadSchema.create, {
      ...data.toJSON(),
      ...formData,
    })

    await data.update(value ?? {}, { transaction: options?.transaction })

    return data
  }

  /**
   *
   * @param id
   * @param options
   */
  public static async delete(
    id: string,
    options?: SqlizeOptions
  ): Promise<void> {
    const isForce = validateBoolean(options?.force)

    const data = await this.findByPk(id, { lang: options?.lang })
    await data.destroy({ force: isForce })
  }

  /**
   *
   * @param id
   * @param options
   */
  public static async restore(
    id: string,
    options?: SqlizeOptions
  ): Promise<void> {
    const data = await this.findByPk(id, {
      paranoid: false,
      lang: options?.lang,
    })

    await data.restore()
  }

  /**
   *
   * @param ids @example ids = ["id_1", "id_2"]
   * @param options
   */
  public static async multipleDelete(
    ids: string[],
    options?: SqlizeOptions
  ): Promise<void> {
    const i18nOpt: string | TOptions = { lng: options?.lang }
    const isForce = validateBoolean(options?.force)

    if (_.isEmpty(ids)) {
      const message = i18nConfig.t('errors.cantBeEmpty', i18nOpt)
      throw new ResponseError.BadRequest(`ids ${message}`)
    }

    await Upload.destroy({
      where: { id: { [Op.in]: ids } },
      force: isForce,
    })
  }

  /**
   *
   * @param ids @example ids = ["id_1", "id_2"]
   * @param options
   */
  public static async multipleRestore(
    ids: string[],
    options?: SqlizeOptions
  ): Promise<void> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    if (_.isEmpty(ids)) {
      const message = i18nConfig.t('errors.cantBeEmpty', i18nOpt)
      throw new ResponseError.BadRequest(`ids ${message}`)
    }

    await Upload.restore({
      where: { id: { [Op.in]: ids } },
    })
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
  ): Promise<{
    dataAwsS3: PutObjectCommandOutput
    resUpload: UploadInstance
  }> {
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
    const signedUrl = await this.getSignedUrlS3(keyFile)

    const formUpload = {
      ...fieldUpload,
      keyFile,
      signedUrl,
      expiryDateUrl: s3ExpiresDate,
    }

    // check uuid
    if (!_.isEmpty(UploadId) && uuidValidate(String(UploadId))) {
      // find upload
      const getUpload = await Upload.findByPk(String(UploadId))

      if (getUpload) {
        resUpload = await getUpload.update(formUpload)
      } else {
        resUpload = await this.create(formUpload)
      }
    } else {
      resUpload = await this.create(formUpload)
    }

    return { dataAwsS3, resUpload }
  }

  /**
   * Update Signed URL Aws S3
   */
  public static async updateSignedUrl(): Promise<void> {
    const getUploads = await Upload.findAll({
      where: { expiryDateUrl: { [Op.lt]: endOfYesterday() } },
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

            const signedUrl = await this.getSignedUrlS3(item.keyFile)

            const formUpload = {
              signedUrl,
              expiresUrlDate: s3ExpiresDate,
            }

            // update signed url & expires url
            await item.update(formUpload)
          }
        }
      }
    }
  }
}

export default UploadService
