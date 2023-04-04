import { type UploadFileEntity } from '@apps/interface/Upload'
import uploadSchema from '@apps/schemas/upload.schema'
import { APP_LANG } from '@config/env'
import { i18nConfig } from '@config/i18n'
import { storageService } from '@config/storage'
import { validateUUID } from '@core/helpers/formatter'
import { optionsYup } from '@core/helpers/yup'
import useQuery from '@core/hooks/useQuery'
import { type DtoFindAll } from '@core/interface/Paginate'
import { type ReqOptions } from '@core/interface/ReqOptions'
import ResponseError from '@core/modules/response/ResponseError'
import Upload, { type UploadAttributes } from '@database/entities/Upload'
import { sub } from 'date-fns'
import { type Request } from 'express'
import { validateBoolean } from 'expresso-core'
import { type TOptions } from 'i18next'
import _ from 'lodash'
import type * as Minio from 'minio'
import { Op } from 'sequelize'
import { validate as uuidValidate } from 'uuid'

export default class UploadService {
  /**
   * Find All
   * @param req
   * @returns
   */
  public static async findAll(req: Request): Promise<DtoFindAll<Upload>> {
    const reqQuery = req.getQuery()

    const defaultLang = reqQuery.lang ?? APP_LANG
    const i18nOpt: string | TOptions = { lng: defaultLang }

    const query = useQuery({ entity: Upload, reqQuery, includeRule: [] })

    const data = await Upload.findAll({
      ...query,
      order: query.order ? query.order : [['createdAt', 'desc']],
    })

    const total = await Upload.count({
      include: query.includeCount,
      where: query.where,
    })

    const message = i18nConfig.t('success.data_received', i18nOpt)
    return { message: `${total} ${message}`, data, total }
  }

  /**
   * Find By Id
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
      paranoid: options?.paranoid,
    })

    if (!data) {
      const message = i18nConfig.t('errors.not_found', i18nOpt)
      throw new ResponseError.NotFound(`upload ${message}`)
    }

    return data
  }

  /**
   * Find By Id
   * @param id
   * @param options
   * @returns
   */
  public static async findByKeyfile(
    id: string,
    options?: ReqOptions
  ): Promise<Upload> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    const newId = validateUUID(id, { ...options })
    const data = await Upload.findOne({
      where: { id: newId },
      paranoid: options?.paranoid,
    })

    if (!data) {
      const message = i18nConfig.t('errors.not_found', i18nOpt)
      throw new ResponseError.NotFound(`upload ${message}`)
    }

    return data
  }

  /**
   * Create
   * @param formData
   * @returns
   */
  public static async create(formData: UploadAttributes): Promise<Upload> {
    const value = uploadSchema.create.validateSync(formData, optionsYup)

    const data = await Upload.create(value)

    return data
  }

  /**
   * Update
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
   * Restore
   * @param id
   * @param options
   */
  public static async restore(id: string, options?: ReqOptions): Promise<void> {
    const data = await this.findById(id, { ...options, paranoid: false })
    await data.restore()
  }

  /**
   * Delete
   * @param id
   * @param options
   */
  private static async _delete(
    id: string,
    options?: ReqOptions
  ): Promise<void> {
    // if true = force delete else soft delete
    const isForce = validateBoolean(options?.force)

    const data = await this.findById(id, { ...options })
    await data.destroy({ force: isForce })
  }

  /**
   * Soft Delete
   * @param id
   * @param options
   */
  public static async softDelete(
    id: string,
    options?: ReqOptions
  ): Promise<void> {
    // soft delete
    await this._delete(id, options)
  }

  /**
   * Force Delete
   * @param id
   * @param options
   */
  public static async forceDelete(
    id: string,
    options?: ReqOptions
  ): Promise<void> {
    // force delete
    await this._delete(id, { ...options, force: true })
  }

  /**
   *
   * @param ids
   * @param options
   */
  private static _validateIds(ids: string[], options?: ReqOptions): void {
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
    this._validateIds(ids, options)

    await Upload.restore({ where: { id: { [Op.in]: ids } } })
  }

  /**
   *
   * @param ids
   * @param options
   */
  private static async _multipleDelete(
    ids: string[],
    options?: ReqOptions
  ): Promise<void> {
    // validate empty ids
    this._validateIds(ids, options)

    // if true = force delete else soft delete
    const isForce = validateBoolean(options?.force)

    await Upload.destroy({ where: { id: { [Op.in]: ids } }, force: isForce })
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
    await this._multipleDelete(ids, options)
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
    // multiple force delete
    await this._multipleDelete(ids, { ...options, force: true })
  }

  /**
   *
   * @param formData
   * @param UploadId
   * @returns
   */
  public static async createOrUpdate(
    formData: UploadAttributes,
    UploadId?: string
  ): Promise<Upload> {
    let data

    if (!_.isEmpty(UploadId) && uuidValidate(String(UploadId))) {
      const getUpload = await this.findById(String(UploadId))

      if (getUpload) {
        // update
        data = await this.update(String(UploadId), {
          ...getUpload,
          ...formData,
        })
      } else {
        // create
        data = await this.create(formData)
      }
    } else {
      // create
      data = await this.create(formData)
    }

    return data
  }

  /**
   *
   * @param keyFile
   * @param options
   * @returns
   */
  public static async getPresignedURL(
    keyFile: string,
    options?: ReqOptions
  ): Promise<Upload> {
    const data = await this.findByKeyfile(keyFile, options)

    const { expiryDate } = storageService.expiresObject()
    const signedURL = await storageService.getPresignedURL(keyFile)

    const value = uploadSchema.create.validateSync(
      { ...data, signedURL, expiryDateURL: expiryDate },
      optionsYup
    )

    const newData = await data.update({ ...data, ...value })

    return newData
  }

  /**
   * Upload File
   * @param params
   * @returns
   */
  public static async uploadFile(params: UploadFileEntity): Promise<{
    storageResponse: any
    uploadResponse: Upload
  }> {
    const { fieldUpload, directory, UploadId } = params

    const { expiryDate } = storageService.expiresObject()
    const keyFile = `${directory}/${fieldUpload.filename}`

    const { data: storageResponse, signedURL } =
      await storageService.uploadFile<Minio.Client>(fieldUpload, directory)

    const formUpload = {
      ...fieldUpload,
      keyFile,
      signedURL,
      expiryDateURL: expiryDate,
    }

    const uploadResponse = await this.createOrUpdate(formUpload, UploadId)
    const data = { storageResponse, uploadResponse }

    return data
  }

  /**
   * Update Signed URL
   */
  public static async updateSignedURL(): Promise<void> {
    // get uploads
    const getUploads = await Upload.findAll({
      where: { updatedAt: { [Op.lte]: sub(new Date(), { days: 3 }) } },
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

            // update signed url
            await this.getPresignedURL(item.keyFile)
          }
        }
      }
    }
  }
}
