import sessionSchema from '@apps/schemas/session.schema'
import { APP_LANG } from '@config/env'
import { i18nConfig } from '@config/i18n'
import { validateUUID } from '@core/helpers/formatter'
import { optionsYup } from '@core/helpers/yup'
import { useQuery } from '@core/hooks/useQuery'
import { type DtoFindAll } from '@core/interface/Paginate'
import { type ReqOptions } from '@core/interface/ReqOptions'
import ResponseError from '@core/modules/response/ResponseError'
import Session, { type SessionAttributes } from '@database/entities/Session'
import User from '@database/entities/User'
import { type Request } from 'express'
import { useSequelize } from 'expresso-query'
import { type TOptions } from 'i18next'

const relations = [{ model: User }]

export default class SessionService {
  /**
   * Find All
   * @param req
   * @returns
   */
  public static async findAll(req: Request): Promise<DtoFindAll<Session>> {
    const reqQuery = req.getQuery()

    const defaultLang = reqQuery.lang ?? APP_LANG
    const i18nOpt: string | TOptions = { lng: defaultLang }

    const query = useQuery({
      entity: Session,
      reqQuery,
      includeRule: useSequelize.makeIncludeQueryable(
        reqQuery.filtered,
        relations
      ),
    })

    const data = await Session.findAll({
      ...query,
      order: query.order ? query.order : [['createdAt', 'desc']],
    })

    const total = await Session.count({
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
  ): Promise<Session> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    const newId = validateUUID(id, { ...options })
    const data = await Session.findOne({
      where: { id: newId },
      paranoid: options?.paranoid,
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

    const newId = validateUUID(UserId, { ...options })
    const data = await Session.findOne({
      where: { UserId: newId, token },
      paranoid: options?.paranoid,
    })

    if (!data) {
      const message = i18nConfig.t('errors.session_ended', i18nOpt)
      throw new ResponseError.Unauthorized(message)
    }

    return data
  }

  /**
   * Create
   * @param formData
   * @returns
   */
  public static async create(formData: SessionAttributes): Promise<Session> {
    const value = sessionSchema.create.validateSync(formData, optionsYup)

    const data = await Session.create(value)

    return data
  }

  /**
   * Create Or Update
   * @param formData
   */
  public static async createOrUpdate(
    formData: SessionAttributes
  ): Promise<void> {
    const value = sessionSchema.create.validateSync(formData, optionsYup)

    // check session
    const data = await Session.findOne({
      where: { UserId: String(value.UserId) },
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
