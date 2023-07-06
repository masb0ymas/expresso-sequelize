import { subDays } from 'date-fns'
import { type Request } from 'express'
import { useSequelize } from 'expresso-query'
import { type TOptions } from 'i18next'
import _ from 'lodash'
import { env } from '~/config/env'
import { i18n } from '~/config/i18n'
import { type IReqOptions } from '~/core/interface/ReqOptions'
import { type DtoFindAll } from '~/core/interface/dto/Paginate'
import { useQuery } from '~/core/modules/hooks/useQuery'
import ResponseError from '~/core/modules/response/ResponseError'
import { validateUUID } from '~/core/utils/formatter'
import Session, { type SessionAttributes } from '~/database/entities/Session'
import User from '~/database/entities/User'
import sessionSchema from '../schema/session.schema'
import { Op } from 'sequelize'

const relations = [{ model: User }]

export default class SessionService {
  /**
   *
   * @param req
   * @returns
   */
  public static async findAll(req: Request): Promise<DtoFindAll<Session>> {
    const reqQuery = req.getQuery()

    const defaultLang = reqQuery.lang ?? env.APP_LANG
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
      order: query.order ? query.order : [['created_at', 'desc']],
    })

    const total = await Session.count({
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
  ): Promise<Session> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    const newId = validateUUID(id, { ...options })
    const data = await Session.findOne({
      where: { id: newId },
      paranoid: options?.paranoid,
    })

    if (!data) {
      const options = { ...i18nOpt, entity: 'session' }
      const message = i18n.t('errors.not_found', options)

      throw new ResponseError.NotFound(message)
    }

    return data
  }

  /**
   *
   * @param user_id
   * @param token
   * @param options
   * @returns
   */
  public static async findByUserToken(
    user_id: string,
    token: string,
    options?: IReqOptions
  ): Promise<Session> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    const newId = validateUUID(user_id, { ...options })
    const data = await Session.findOne({
      where: { user_id: newId, token },
      paranoid: options?.paranoid,
    })

    if (!data) {
      const message = i18n.t('errors.session_ended', i18nOpt)
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
    const value = sessionSchema.create.parse(formData)
    const data = await Session.create(value)

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
    formData: SessionAttributes,
    options?: IReqOptions
  ): Promise<Session | undefined> {
    const data = await this.findById(id, { ...options })

    const value = sessionSchema.create.parse({ ...data, ...formData })
    const newData = await data.update({ ...data, ...value })

    return newData
  }

  /**
   *
   * @param formData
   */
  public static async createOrUpdate(
    formData: SessionAttributes
  ): Promise<void> {
    const value = sessionSchema.create.parse(formData)

    // check session
    const data = await Session.findOne({
      where: { user_id: String(value.user_id) },
    })

    if (!data) {
      await this.create(formData)
    } else {
      await data.update({ ...data, ...value })
    }
  }

  /**
   *
   * @param user_id
   * @param token
   */
  public static async deleteByUserToken(
    user_id: string,
    token: string
  ): Promise<void> {
    // delete record
    await Session.destroy({ where: { user_id, token } })
  }

  /**
   *
   * @param id
   * @param options
   */
  public static async delete(id: string, options?: IReqOptions): Promise<void> {
    const data = await this.findById(id, { ...options })
    await Session.destroy({ where: { id: data.id } })
  }

  /**
   * Delete Expired Session
   */
  public static async deleteExpiredSession(): Promise<void> {
    const subSevenDays = subDays(new Date(), 7)

    const condition = {
      created_at: { [Op.lte]: subSevenDays },
    }

    const getSession = await Session.findAll({ where: condition })

    if (!_.isEmpty(getSession)) {
      // remove session
      await Session.destroy({ where: condition })
    }
  }

  /**
   *
   * @param token
   * @returns
   */
  public static async getByToken(token: string): Promise<Session[]> {
    const data = await Session.findAll({
      where: { token },
    })

    return data
  }
}
