import { subDays } from 'date-fns'
import { type Request } from 'express'
import { useSequelize } from 'expresso-query'
import { type TOptions } from 'i18next'
import _ from 'lodash'
import { Op } from 'sequelize'
import { env } from '~/config/env'
import { i18n } from '~/config/i18n'
import { type IReqOptions } from '~/core/interface/ReqOptions'
import { type DtoFindAll } from '~/core/interface/dto/Paginate'
import { useQuery } from '~/core/modules/hooks/useQuery'
import ErrorResponse from '~/core/modules/response/ErrorResponse'
import { validateUUID } from '~/core/utils/uuid'
import Session, { type SessionAttributes } from '~/database/entities/Session'
import User from '~/database/entities/User'
import sessionSchema from '../schema/session.schema'
import BaseService from './base.service'

const relations = [{ model: User }]

export default class SessionService extends BaseService {
  constructor() {
    super({ entity: 'session', repository: Session })
  }

  /**
   *
   * @param req
   * @returns
   */
  public async findAll(req: Request): Promise<DtoFindAll<Session>> {
    // OVERRIDE FIND ALL
    await super.findAll(req)

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
   *
   * @param user_id
   * @param token
   * @param options
   * @returns
   */
  public async findByUserToken(
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
      throw new ErrorResponse.Unauthorized(message)
    }

    return data
  }

  /**
   *
   * @param formData
   * @returns
   */
  public async create(formData: SessionAttributes): Promise<Session> {
    const value = sessionSchema.create.parse(formData)
    const data = await Session.create(value)

    return data
  }

  /**
   *
   * @param formData
   */
  public async createOrUpdate(formData: SessionAttributes): Promise<void> {
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
  public async deleteByUserToken(
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
  public async delete(id: string, options?: IReqOptions): Promise<void> {
    const data = await this.findById(id, { ...options })
    await Session.destroy({ where: { id: data.id } })
  }

  /**
   * Delete Expired Session
   */
  public async deleteExpiredSession(): Promise<void> {
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
  public async getByToken(token: string): Promise<Session[]> {
    const data = await Session.findAll({
      where: { token },
    })

    return data
  }
}
