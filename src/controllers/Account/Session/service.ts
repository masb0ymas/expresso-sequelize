import { APP_LANG } from '@config/env'
import { i18nConfig } from '@config/i18nextConfig'
import models from '@database/models/index'
import { SessionAttributes, SessionInstance } from '@database/models/session'
import { validateUUID } from '@expresso/helpers/Formatter'
import useValidation from '@expresso/hooks/useValidation'
import ResponseError from '@expresso/modules/Response/ResponseError'
import {
  DtoFindAll,
  SqlizeOptions,
} from '@expresso/modules/SqlizeQuery/interface'
import PluginSqlizeQuery from '@expresso/modules/SqlizeQuery/PluginSqlizeQuery'
import { Request } from 'express'
import { TOptions } from 'i18next'
import sessionSchema from './schema'

const { Session, User } = models
const including = [{ model: User }]

interface DtoPaginate extends DtoFindAll {
  data: SessionInstance[]
}

class SessionService {
  /**
   *
   * @param req
   * @returns
   */
  public static async findAll(req: Request): Promise<DtoPaginate> {
    const { filtered, lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG
    const i18nOpt: string | TOptions = { lng: defaultLang }

    const { includeCount, order, ...queryFind } = PluginSqlizeQuery.generate(
      req.query,
      Session,
      PluginSqlizeQuery.makeIncludeQueryable(filtered, including)
    )

    const data = await Session.findAll({
      ...queryFind,
      order: order.length ? order : [['createdAt', 'desc']],
    })
    const total = await Session.count({
      include: includeCount,
      where: queryFind.where,
    })

    const message = i18nConfig.t('success.dataReceived', i18nOpt)
    return { message: `${total} ${message}`, data, total }
  }

  /**
   *
   * @param id
   * @param options
   * @returns
   */
  public static async findByPk(
    id: string,
    options?: SqlizeOptions
  ): Promise<SessionInstance> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    const newId = validateUUID(id, { lang: options?.lang })
    const data = await Session.findByPk(newId, {
      include: options?.include,
      order: options?.order,
      paranoid: options?.paranoid,
    })

    if (!data) {
      const message = i18nConfig.t('errors.notFound', i18nOpt)
      throw new ResponseError.NotFound(`session ${message}`)
    }

    return data
  }

  /**
   *
   * @param id
   * @param options
   * @returns
   */
  public static async findById(
    id: string,
    options?: SqlizeOptions
  ): Promise<SessionInstance> {
    const data = await this.findByPk(id, { ...options })

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
    options?: SqlizeOptions
  ): Promise<SessionInstance> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    const data = await Session.findOne({ where: { UserId, token } })

    if (!data) {
      const message = i18nConfig.t('errors.sessionEnded', i18nOpt)
      throw new ResponseError.Unauthorized(message)
    }

    return data
  }

  /**
   *
   * @param formData
   * @param options
   * @returns
   */
  public static async create(
    formData: SessionAttributes,
    options?: SqlizeOptions
  ): Promise<SessionInstance> {
    const value = useValidation(sessionSchema.create, formData)
    const data = await Session.create(value, {
      transaction: options?.transaction,
    })

    return data
  }

  /**
   *
   * @param formData
   * @param options
   */
  public static async createOrUpdate(
    formData: SessionAttributes,
    options?: SqlizeOptions
  ): Promise<void> {
    const value = useValidation(sessionSchema.create, formData)
    const data = await Session.findOne({ where: { UserId: value.UserId } })

    if (!data) {
      await this.create(formData, { transaction: options?.transaction })
    } else {
      await data.update(value, { transaction: options?.transaction })
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
    await Session.destroy({ where: { UserId, token } })
  }

  /**
   *
   * @param id
   * @param options
   */
  public static async delete(
    id: string,
    options?: SqlizeOptions
  ): Promise<void> {
    const data = await this.findById(id, { lang: options?.lang })
    await data.destroy()
  }
}

export default SessionService
