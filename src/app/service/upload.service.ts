import { sub } from 'date-fns'
import { TypeMinio } from 'expresso-provider/lib/storage/types'
import { type TOptions } from 'i18next'
import _ from 'lodash'
import { Op } from 'sequelize'
import { validate as uuidValidate } from 'uuid'
import { i18n } from '~/config/i18n'
import { storageService } from '~/config/storage'
import { type IReqOptions } from '~/core/interface/ReqOptions'
import ErrorResponse from '~/core/modules/response/ErrorResponse'
import Upload, { type UploadAttributes } from '~/database/entities/Upload'
import { type UploadFileEntity } from '../interface/Upload'
import uploadSchema from '../schema/upload.schema'
import BaseService from './base.service'

export default class UploadService extends BaseService {
  constructor() {
    super({ entity: 'upload', repository: Upload })
  }

  /**
   *
   * @param key_file
   * @param options
   * @returns
   */
  public async findByKeyFile(
    key_file: string,
    options?: IReqOptions
  ): Promise<Upload> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    const data = await this.repository.findOne({
      where: { key_file },
      paranoid: options?.paranoid,
    })

    const entity = this.entity.replace('_', ' ')

    if (!data) {
      const options = { ...i18nOpt, entity }
      const message = i18n.t('errors.not_found', options)

      throw new ErrorResponse.NotFound(message)
    }

    return data
  }

  /**
   *
   * @param formData
   * @returns
   */
  public async create(formData: UploadAttributes): Promise<Upload> {
    const value = uploadSchema.create.parse(formData)

    const data = await Upload.create(value)
    return data
  }

  /**
   *
   * @param formData
   * @param upload_id
   * @returns
   */
  public async createOrUpdate(
    formData: UploadAttributes,
    upload_id?: string
  ): Promise<Upload> {
    let data

    if (!_.isEmpty(upload_id) && uuidValidate(String(upload_id))) {
      const getUpload = await this.findById(String(upload_id))

      if (!getUpload) {
        // create
        data = await this.create(formData)
      }

      // update
      data = await this.update(String(upload_id), {
        ...getUpload,
        ...formData,
      })
    } else {
      // create
      data = await this.create(formData)
    }

    return data
  }

  /**
   *
   * @param key_file
   * @param options
   * @returns
   */
  public async getPresignedURL(
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
  public async uploadFile(params: UploadFileEntity): Promise<{
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
  public async updateSignedURL(): Promise<void> {
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
