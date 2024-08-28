import { Request } from 'express'
import { validate } from 'expresso-core'
import { TOptions } from 'i18next'
import _ from 'lodash'
import { ModelStatic, Op } from 'sequelize'
import { env } from '~/config/env'
import { i18n } from '~/config/i18n'
import { IReqOptions } from '~/core/interface/ReqOptions'
import { useQuery } from '~/core/modules/hooks/useQuery'
import ErrorResponse from '~/core/modules/response/ErrorResponse'
import { validateUUID } from '~/core/utils/uuid'

interface IBaseService {
  entity: string
  repository: ModelStatic<any>
}

export default class BaseService {
  public entity: string
  public repository: ModelStatic<any>

  constructor(params: IBaseService) {
    this.entity = params.entity
    this.repository = params.repository
  }

  /**
   *
   * @param req
   * @returns
   */
  public async findAll(req: Request): Promise<{
    message: string
    data: any[]
    total: number
  }> {
    const reqQuery = req.getQuery()
    const defaultLang = reqQuery.lang ?? env.APP_LANG
    const i18nOpt: string | TOptions = { lng: defaultLang }

    const query = useQuery({
      entity: this.repository,
      reqQuery,
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

    const message = i18n.t('success.data_received', i18nOpt)
    return { message: `${total} ${message}`, data, total }
  }

  /**
   *
   * @param id
   * @param options
   * @returns
   */
  protected async _findOne(id: string, options?: IReqOptions) {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    const newId = validateUUID(id, { ...options })
    const data = await this.repository.findOne({
      where: { id: newId },
      include: options?.include,
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
   * @param id
   * @param options
   * @returns
   */
  public async findById(id: string, options?: IReqOptions) {
    const data = await this._findOne(id, { ...options })
    return data
  }

  /**
   *
   * @param id
   * @param formData
   * @param options
   * @returns
   */
  public async update(id: string, formData: any, options?: IReqOptions) {
    const getOne = await this._findOne(id, { ...options })

    const data = await getOne.update({ ...getOne, ...formData })
    return data
  }

  /**
   *
   * @param id
   * @param options
   */
  public async restore(id: string, options?: IReqOptions): Promise<void> {
    const data = await this._findOne(id, { ...options, paranoid: false })
    await data.restore()
  }

  /**
   *
   * @param id
   * @param options
   */
  private async _delete(id: string, options?: IReqOptions): Promise<void> {
    // if true = force delete else soft delete
    const isForce = validate.boolean(options?.force)

    const data = await this._findOne(id, { ...options })
    await data.destroy({ force: isForce })
  }

  /**
   *
   * @param id
   * @param options
   */
  public async softDelete(id: string, options?: IReqOptions): Promise<void> {
    // soft delete
    await this._delete(id, options)
  }

  /**
   *
   * @param id
   * @param options
   */
  public async forceDelete(id: string, options?: IReqOptions): Promise<void> {
    // force delete
    await this._delete(id, { ...options, force: true })
  }

  /**
   *
   * @param ids
   * @param options
   */
  private _validateGetByIds(ids: string[], options?: IReqOptions): void {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    if (_.isEmpty(ids)) {
      const message = i18n.t('errors.cant_be_empty', i18nOpt)
      throw new ErrorResponse.BadRequest(`ids ${message}`)
    }
  }

  /**
   *
   * @param ids
   * @param options
   */
  public async multipleRestore(
    ids: string[],
    options?: IReqOptions
  ): Promise<void> {
    this._validateGetByIds(ids, options)

    await this.repository.restore({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    })
  }

  /**
   *
   * @param ids
   * @param options
   */
  private async _multipleDelete(
    ids: string[],
    options?: IReqOptions
  ): Promise<void> {
    // validate empty ids
    this._validateGetByIds(ids, options)

    // if true = force delete else soft delete
    const isForce = validate.boolean(options?.force)

    await this.repository.destroy({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      force: isForce,
    })
  }

  /**
   *
   * @param ids
   * @param options
   */
  public async multipleSoftDelete(
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
  public async multipleForceDelete(
    ids: string[],
    options?: IReqOptions
  ): Promise<void> {
    // multiple force delete
    await this._multipleDelete(ids, { ...options, force: true })
  }
}
