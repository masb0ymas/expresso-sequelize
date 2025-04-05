import { sub } from 'date-fns'
import _ from 'lodash'
import { Model, ModelStatic, Op } from 'sequelize'
import { validate as uuidValidate } from 'uuid'
import { storage } from '~/config/storage'
import ErrorResponse from '~/lib/http/errors'
import { FileParams } from '~/lib/storage/types'
import Upload from '../database/entity/upload'
import { UploadSchema, uploadSchema } from '../database/schema/upload'
import BaseService from './base'

// Define a type that ensures Upload is recognized as a Sequelize Model
type UploadModel = Upload & Model

type UploadFileParams = {
  file: FileParams
  directory: string
  upload_id?: string
}

export default class UploadService extends BaseService<UploadModel> {
  constructor() {
    super({
      repository: Upload as unknown as ModelStatic<UploadModel>,
      schema: uploadSchema,
      model: 'upload',
    })
  }

  /**
   * Find upload by keyfile
   */
  async findByKeyfile(keyfile: string): Promise<Upload> {
    const record = await this.repository.findOne({ where: { keyfile } })

    if (!record) {
      throw new ErrorResponse.NotFound('upload not found')
    }

    return record
  }

  /**
   * Find upload with presigned url
   */
  async findWithPresignedUrl(keyfile: string) {
    const record = await this.findByKeyfile(keyfile)
    const signedUrl = storage.presignedUrl(record.keyfile)

    const value = uploadSchema.parse({ ...record, signed_url: signedUrl })
    const data = await this.repository.update(value, { where: { id: record.id } })

    return data
  }

  /**
   * Create or update upload
   */
  async createOrUpdate(formData: UploadSchema, upload_id?: string) {
    const values = uploadSchema.parse(formData)

    if (upload_id && uuidValidate(upload_id)) {
      const record = await this.repository.findOne({ where: { id: upload_id } })

      if (record) {
        return record.update({ ...record, ...values })
      }
    }

    return this.repository.create(values)
  }

  /**
   * Upload file to storage
   */
  async uploadFile({ file, directory, upload_id }: UploadFileParams) {
    const { expiryDate } = storage.expiresObject()
    const keyfile = `${directory}/${file.filename}`

    const { data, signedUrl } = await storage.uploadFile({ file, directory })

    const formValues = {
      ...file,
      keyfile,
      signed_url: signedUrl,
      expiry_date_url: expiryDate,
    }

    const result = await this.createOrUpdate(formValues, upload_id)
    return { storage: data, upload: result }
  }

  /**
   * Update signed url for old upload
   */
  async updateSignedUrl() {
    const fiveDaysAgo = sub(new Date(), { days: 5 })

    const records = await this.repository.findAll({
      where: { updated_at: { [Op.lte]: fiveDaysAgo } },
      limit: 10,
      order: [['updated_at', 'ASC']],
    })

    const { expiryDate } = storage.expiresObject()

    if (!_.isEmpty(records)) {
      for (const record of records) {
        const signedUrl = storage.presignedUrl(record.keyfile)
        const formValues = {
          ...record,
          signed_url: signedUrl,
          expiry_date_url: expiryDate,
        }

        await record.update({ ...record, ...formValues })
      }
    }
  }
}
