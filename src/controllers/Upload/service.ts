import {
  GetObjectCommand,
  PutObjectCommand,
  PutObjectCommandOutput,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { clientS3, s3ExpiresDate, s3ObjectExpired } from '@config/clientS3'
import { AWS_BUCKET_NAME } from '@config/env'
import models from '@database/models/index'
import { UploadAttributes, UploadInstance } from '@database/models/upload'
import db from '@database/models/_instance'
import { validateBoolean, validateUUID } from '@expresso/helpers/Formatter'
import useValidation from '@expresso/hooks/useValidation'
import { FileAttributes } from '@expresso/interfaces/Files'
import ResponseError from '@expresso/modules/Response/ResponseError'
import { DtoFindAll } from '@expresso/modules/SqlizeQuery/interface'
import PluginSqlizeQuery from '@expresso/modules/SqlizeQuery/PluginSqlizeQuery'
import { endOfYesterday } from 'date-fns'
import { Request } from 'express'
import fs from 'fs'
import _ from 'lodash'
import { Includeable, Order, Transaction } from 'sequelize'
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

    return { message: `${total} data has been received.`, data, total }
  }

  /**
   *
   * @param id
   * @param options
   * @returns
   */
  public static async findByPk(
    id: string,
    options?: {
      include?: Includeable | Includeable[]
      order?: Order
      paranoid?: boolean
    }
  ): Promise<UploadInstance> {
    const newId = validateUUID(id)
    const data = await Upload.findByPk(newId, {
      include: options?.include,
      order: options?.order,
      paranoid: options?.paranoid,
    })

    if (!data) {
      throw new ResponseError.NotFound(
        'upload data not found or has been deleted'
      )
    }

    return data
  }

  /**
   *
   * @param id
   * @param paranoid
   * @returns
   */
  public static async findById(
    id: string,
    paranoid?: boolean
  ): Promise<UploadInstance> {
    const data = await this.findByPk(id, { paranoid })

    return data
  }

  /**
   *
   * @param formData
   * @param txn
   * @returns
   */
  public static async create(
    formData: UploadAttributes,
    txn?: Transaction
  ): Promise<UploadInstance> {
    const value = useValidation(uploadSchema.create, formData)
    const data = await Upload.create(value, { transaction: txn })

    return data
  }

  /**
   *
   * @param id
   * @param formData
   * @param txn
   * @returns
   */
  public static async update(
    id: string,
    formData: Partial<UploadAttributes>,
    txn?: Transaction
  ): Promise<UploadInstance> {
    const data = await this.findByPk(id)

    const value = useValidation(uploadSchema.create, {
      ...data.toJSON(),
      ...formData,
    })

    await data.update(value ?? {}, { transaction: txn })

    return data
  }

  /**
   *
   * @param id
   * @param force
   */
  public static async delete(id: string, force?: boolean): Promise<void> {
    const isForce = validateBoolean(force)

    const data = await this.findByPk(id)
    await data.destroy({ force: isForce })
  }

  /**
   *
   * @param id
   */
  public static async restore(id: string): Promise<void> {
    const data = await this.findByPk(id, { paranoid: false })

    await data.restore()
  }

  /**
   *
   * @param ids @example ids = ["id_1", "id_2"]
   * @param force
   */
  public static async multipleDelete(
    ids: string[],
    force?: boolean
  ): Promise<void> {
    const isForce = validateBoolean(force)

    if (_.isEmpty(ids)) {
      throw new ResponseError.BadRequest('ids cannot be empty')
    }

    await Upload.destroy({
      where: { id: { [Op.in]: ids } },
      force: isForce,
    })
  }

  /**
   *
   * @param ids @example ids = ["id_1", "id_2"]
   */
  public static async multipleRestore(ids: string[]): Promise<void> {
    if (_.isEmpty(ids)) {
      throw new ResponseError.BadRequest('ids cannot be empty')
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
