import { sub } from 'date-fns'
import { type Request } from 'express'
import { validateBoolean } from 'expresso-core'
import { TypeMinio } from 'expresso-provider/lib/storage/types'
import { type TOptions } from 'i18next'
import _ from 'lodash'
import { Op } from 'sequelize'
import { validate as uuidValidate } from 'uuid'
import { env } from '~/config/env'
import { i18n } from '~/config/i18n'
import { storageService } from '~/config/storage'
import { type IReqOptions } from '~/core/interface/ReqOptions'
import { type DtoFindAll } from '~/core/interface/dto/Paginate'
import { useQuery } from '~/core/modules/hooks/useQuery'
import ResponseError from '~/core/modules/response/ResponseError'
import { validateUUID } from '~/core/utils/formatter'
import Upload, { type UploadAttributes } from '~/database/entities/Upload'
import { type UploadFileEntity } from '../interface/Upload'
import uploadSchema from '../schema/upload.schema'

export default class UploadService {
  /**
   *
   * @param req
   * @returns
   */
  public static async findAll(req: Request): Promise<DtoFindAll<Upload>> {
    const reqQuery = req.getQuery()

    const defaultLang = reqQuery.lang ?? env.APP_LANG
    const i18nOpt: string | TOptions = { lng: defaultLang }

    const query = useQuery({ entity: Upload, reqQuery, includeRule: [] })

    const data = await Upload.findAll({
      ...query,
      order: query.order ? query.order : [['created_at', 'desc']],
    })

    const total = await Upload.count({
      include: query.includeCount,
      where: query.where,
    })

    const message = i18n.t('success.data_received', i18nOpt)
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
    options?: IReqOptions
  ): Promise<Upload> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    const newId = validateUUID(id, { ...options })
    const data = await Upload.findOne({
      where: { id: newId },
      paranoid: options?.paranoid,
    })

    if (!data) {
      const options = { ...i18nOpt, entity: 'upload' }
      const message = i18n.t('errors.not_found', options)

      throw new ResponseError.NotFound(message)
    }

    return data
  }

  /**
   *
   * @param key_file
   * @param options
   * @returns
   */
  public static async findByKeyFile(
    key_file: string,
    options?: IReqOptions
  ): Promise<Upload> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    const data = await Upload.findOne({
      where: { key_file },
      paranoid: options?.paranoid,
    })

    if (!data) {
      const options = { ...i18nOpt, entity: 'upload' }
      const message = i18n.t('errors.not_found', options)

      throw new ResponseError.NotFound(message)
    }

    return data
  }

  /**
   *
   * @param formData
   * @returns
   */
  public static async create(formData: UploadAttributes): Promise<Upload> {
    const value = uploadSchema.create.parse(formData)

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
    formData: UploadAttributes,
    options?: IReqOptions
  ): Promise<Upload> {
    const data = await this.findById(id, { ...options })

    const value = uploadSchema.create.parse({ ...data, ...formData })

    const newData = await data.update({ ...data, ...value })

    return newData
  }

  /**
   *
   * @param formData
   * @param upload_id
   * @returns
   */
  public static async createOrUpdate(
    formData: UploadAttributes,
    upload_id?: string
  ): Promise<Upload> {
    let data

    if (!_.isEmpty(upload_id) && uuidValidate(String(upload_id))) {
      const getUpload = await this.findById(String(upload_id))

      if (getUpload) {
        // update
        data = await this.update(String(upload_id), {
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
   * @param id
   * @param options
   */
  public static async restore(
    id: string,
    options?: IReqOptions
  ): Promise<void> {
    const data = await this.findById(id, { ...options, paranoid: false })
    await data.restore()
  }

  /**
   *
   * @param id
   * @param options
   */
  private static async _delete(
    id: string,
    options?: IReqOptions
  ): Promise<void> {
    // if true = force delete else soft delete
    const isForce = validateBoolean(options?.force)

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
    options?: IReqOptions
  ): Promise<void> {
    // soft delete
    await this._delete(id, options)
  }

  /**
   *
   * @param id
   * @param options
   */
  public static async forceDelete(
    id: string,
    options?: IReqOptions
  ): Promise<void> {
    // force delete
    await this._delete(id, { ...options, force: true })
  }

  /**
   *
   * @param ids
   * @param options
   */
  private static _validateGetByIds(ids: string[], options?: IReqOptions): void {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    if (_.isEmpty(ids)) {
      const message = i18n.t('errors.cant_be_empty', i18nOpt)
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
    options?: IReqOptions
  ): Promise<void> {
    this._validateGetByIds(ids, options)

    await Upload.restore({ where: { id: { [Op.in]: ids } } })
  }

  /**
   *
   * @param ids
   * @param options
   */
  private static async _multipleDelete(
    ids: string[],
    options?: IReqOptions
  ): Promise<void> {
    // validate empty ids
    this._validateGetByIds(ids, options)

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
    options?: IReqOptions
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
    options?: IReqOptions
  ): Promise<void> {
    // multiple force delete
    await this._multipleDelete(ids, { ...options, force: true })
  }

  /**
   *
   * @param key_file
   * @param options
   * @returns
   */
  public static async getPresignedURL(
    key_file: string,
    options?: IReqOptions
  ): Promise<Upload> {
    const data = await this.findByKeyFile(key_file, options)

    const { expiryDate } = storageService.expiresObject()
    const signed_url = await storageService.getPresignedURL(key_file)

    const value = uploadSchema.create.parse({
      ...data,
      signed_url,
      expiry_date_url: expiryDate,
    })

    const newData = await data.update({ ...data, ...value })

    return newData
  }

  /**
   *
   * @param params
   * @returns
   */
  public static async uploadFile(params: UploadFileEntity): Promise<{
    storageResponse: any
    uploadResponse: Upload
  }> {
    const { fieldUpload, directory, upload_id } = params

    const { expiryDate } = storageService.expiresObject()
    const key_file = `${directory}/${fieldUpload.filename}`

    const { data: storageResponse, signedURL: signed_url } =
      await storageService.uploadFile<TypeMinio>(fieldUpload, directory)

    const formUpload = {
      ...fieldUpload,
      key_file,
      signed_url,
      expiry_date_url: expiryDate,
    }

    const uploadResponse = await this.createOrUpdate(formUpload, upload_id)
    const data = { storageResponse, uploadResponse }

    return data
  }

  /**
   * Update Signed URL
   */
  public static async updateSignedURL(): Promise<void> {
    // get uploads
    const getUploads = await Upload.findAll({
      where: { updated_at: { [Op.lte]: sub(new Date(), { days: 3 }) } },
      limit: 10,
      order: ['updated_at', 'ASC'],
    })

    const { expiryDate } = storageService.expiresObject()

    // check uploads
    if (!_.isEmpty(getUploads)) {
      for (let i = 0; i < getUploads.length; i += 1) {
        const item = getUploads[i]

        const signed_url = await storageService.getPresignedURL(item.key_file)

        // update signed url
        await Upload.update(
          { signed_url, expiry_date_url: expiryDate },
          { where: { id: item.id } }
        )
      }
    }
  }
}
