import { APP_LANG } from '@config/env'
import { i18nConfig } from '@config/i18nextConfig'
import Session, { SessionAttributes } from '@database/entities/Session'
import { validateUUID } from '@expresso/helpers/Formatter'
import { optionsYup } from '@expresso/helpers/Validation'
import { DtoFindAll } from '@expresso/interfaces/Paginate'
import { ReqOptions } from '@expresso/interfaces/ReqOptions'
import ResponseError from '@expresso/modules/Response/ResponseError'
import PluginSqlizeQuery from '@expresso/modules/SqlizeQuery/PluginSqlizeQuery'
import { Request } from 'express'
import { TOptions } from 'i18next'
import sessionSchema from './schema'

class SessionService {
  /**
   *
   * @param req
   * @returns
   */
  public static async findAll(req: Request): Promise<DtoFindAll<Session>> {
    const { lang } = req.getQuery()

    const defaultLang = lang ?? APP_LANG
    const i18nOpt: string | TOptions = { lng: defaultLang }

    const { includeCount, order, ...queryFind } = PluginSqlizeQuery.generate(
      req.query,
      Session,
      []
    )

    const data = await Session.findAll({
      ...queryFind,
      order: order.length ? order : [['createdAt', 'desc']],
    })
    const total = await Session.count({
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
  ): Promise<Session> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    const newId = validateUUID(id, { ...options })
    const data = await Session.findOne({
      where: { id: newId },
      paranoid: options?.isParanoid,
    })

    if (!data) {
      const message = i18nConfig.t('errors.not_found', i18nOpt)
      throw new ResponseError.NotFound(`session ${message}`)
    }

    return data
  }

  /**
   *
   * @param UserId
   * @param token
   * @param options
   * @returns
   */
  public static async findByUserToken(
    UserId: string,
    token: string,
    options?: ReqOptions
  ): Promise<Session> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    const data = await Session.findOne({ where: { UserId, token } })

    if (!data) {
      const message = i18nConfig.t('errors.session_ended', i18nOpt)
      throw new ResponseError.Unauthorized(message)
    }

    return data
  }

  /**
   *
   * @param formData
   * @returns
   */
  public static async create(formData: SessionAttributes): Promise<Session> {
    const value = sessionSchema.create.validateSync(formData, optionsYup)

    const data = await Session.create(value)

    return data
  }

  /**
   *
   * @param formData
   */
  public static async createOrUpdate(
    formData: SessionAttributes
  ): Promise<void> {
    const value = sessionSchema.create.validateSync(formData, optionsYup)

    const data = await Session.findOne({
      where: { UserId: value.UserId },
    })

    if (!data) {
      await this.create(formData)
    } else {
      await data.update({ ...data, ...value })
    }
  }

  /**
   *
   * @param UserId
   * @param token
   */
  public static async deleteByUserToken(
    UserId: string,
    token: string
  ): Promise<void> {
    // delete record
    await Session.destroy({ where: { UserId, token } })
  }

  /**
   *
   * @param id
   * @param options
   */
  public static async delete(id: string, options?: ReqOptions): Promise<void> {
    const data = await this.findById(id, { ...options })
    await Session.destroy({ where: { id: data.id } })
  }
}

export default SessionService
