import _ from 'lodash'
import { Attributes, Model, ModelStatic, NonNullFindOptions, Op } from 'sequelize'
import { z } from 'zod'
import ErrorResponse from '~/lib/http/errors'
import { useQuery } from '~/lib/query-builder'
import { validate } from '~/lib/validate'
import { BaseServiceParams, DtoFindAll, FindParams } from './types'

export default class BaseService<T extends Model> {
  public repository: ModelStatic<T>
  private _schema: z.ZodType<any>
  protected _model: string

  constructor({ repository, schema, model }: BaseServiceParams<T>) {
    this.repository = repository
    this._schema = schema
    this._model = model
  }

  /**
   * Find all
   */
  async find({ page, pageSize, filtered = [], sorted = [] }: FindParams): Promise<DtoFindAll<T>> {
    const query = useQuery({
      model: this.repository,
      reqQuery: { page, pageSize, filtered, sorted },
      includeRule: [],
    })

    const data = await this.repository.findAll({
      ...query,
      order: query.order ? query.order : [['created_at', 'desc']],
    })

    const total = await this.repository.count({
      include: query.includeCount,
      where: query.where,
    })

    return { data, total }
  }

  /**
   * Find one
   */
  protected async _findOne(options: NonNullFindOptions<Attributes<T>>): Promise<T> {
    const record = await this.repository.findOne(options)

    if (!record) {
      throw new ErrorResponse.NotFound(`${this._model} not found`)
    }

    return record
  }

  /**
   * Find by id
   */
  async findById(id: string, options?: NonNullFindOptions<Attributes<T>>): Promise<T> {
    const newId = validate.uuid(id)

    // @ts-expect-error
    return this._findOne({ where: { id: newId }, ...options })
  }

  /**
   * Create
   */
  async create(data: T): Promise<T> {
    const values = this._schema.parse(data)
    return this.repository.create(values)
  }

  /**
   * Update
   */
  async update(id: string, data: T): Promise<T> {
    const record = await this.findById(id)

    const values = this._schema.parse({ ...record, ...data })
    return record.update({ ...record, ...values })
  }

  /**
   * Restore
   */
  async restore(id: string) {
    const record = await this.findById(id, { rejectOnEmpty: true, paranoid: true })

    // @ts-expect-error
    await this.repository.restore({ where: { id: record.id } })
  }

  /**
   * Soft delete
   */
  async softDelete(id: string) {
    const record = await this.findById(id, { rejectOnEmpty: true, paranoid: true })

    // @ts-expect-error
    await this.repository.destroy({ where: { id: record.id }, force: false })
  }

  /**
   * Force delete
   */
  async forceDelete(id: string) {
    const record = await this.findById(id, { rejectOnEmpty: true, paranoid: true })

    // @ts-expect-error
    await this.repository.destroy({ where: { id: record.id }, force: true })
  }

  /**
   * Validate ids
   */
  private _validateIds(ids: string[]): string[] {
    if (_.isEmpty(ids)) {
      throw new ErrorResponse.BadRequest('ids is required')
    }

    return ids.map(validate.uuid)
  }

  /**
   * Multiple restore
   */
  async multipleRestore(ids: string[]) {
    const newIds = this._validateIds(ids)

    // @ts-expect-error
    await this.repository.restore({ where: { id: { [Op.in]: newIds } }, paranoid: true })
  }

  /**
   * Multiple soft delete
   */
  async multipleSoftDelete(ids: string[]) {
    const newIds = this._validateIds(ids)

    // @ts-expect-error
    await this.repository.destroy({ where: { id: { [Op.in]: newIds } }, force: false })
  }

  /**
   * Multiple force delete
   */
  async multipleForceDelete(ids: string[]) {
    const newIds = this._validateIds(ids)

    // @ts-expect-error
    await this.repository.destroy({ where: { id: { [Op.in]: newIds } }, force: true })
  }
}
