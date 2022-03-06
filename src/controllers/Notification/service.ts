import { APP_LANG } from '@config/env'
import { i18nConfig } from '@config/i18nextConfig'
import FcmTokenService from '@controllers/Account/FCMToken/service'
import models from '@database/models'
import {
  NotificationAttributes,
  NotificationInstance,
} from '@database/models/notification'
import db from '@database/models/_instance'
import FCMHelper from '@expresso/helpers/Fcm'
import { validateBoolean, validateUUID } from '@expresso/helpers/Formatter'
import useValidation from '@expresso/hooks/useValidation'
import ResponseError from '@expresso/modules/Response/ResponseError'
import {
  DtoFindAll,
  SqlizeOptions,
} from '@expresso/modules/SqlizeQuery/interface'
import PluginSqlizeQuery from '@expresso/modules/SqlizeQuery/PluginSqlizeQuery'
import chalk from 'chalk'
import { startOfDay } from 'date-fns'
import { Request } from 'express'
import { TOptions } from 'i18next'
import _ from 'lodash'
import notificationSchema from './schema'

const { Sequelize } = db
const { Op } = Sequelize
const { Notification } = models

interface DtoPaginate extends DtoFindAll {
  data: NotificationInstance[]
}

class NotificationService {
  /**
   *
   * @param req Request
   */
  public static async findAll(req: Request): Promise<DtoPaginate> {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG
    const i18nOpt: string | TOptions = { lng: defaultLang }

    const { includeCount, order, ...queryFind } = PluginSqlizeQuery.generate(
      req.query,
      Notification,
      []
    )

    const data = await Notification.findAll({
      ...queryFind,
      order: order.length ? order : [['createdAt', 'desc']],
    })
    const total = await Notification.count({
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
  ): Promise<NotificationInstance> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    const newId = validateUUID(id, { lang: options?.lang })
    const data = await Notification.findByPk(newId, {
      include: options?.include,
      order: options?.order,
      paranoid: options?.paranoid,
    })

    if (!data) {
      const message = i18nConfig.t('errors.notFound', i18nOpt)
      throw new ResponseError.NotFound(`notification ${message}`)
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
  ): Promise<NotificationInstance> {
    const data = await this.findByPk(id, { ...options })

    return data
  }

  /**
   *
   * @param formData
   * @param options
   * @returns
   */
  public static async create(
    formData: NotificationAttributes,
    options?: SqlizeOptions
  ): Promise<NotificationInstance> {
    const value = useValidation(notificationSchema.create, formData)
    const data = await Notification.create(value, {
      transaction: options?.transaction,
    })

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
    formData: Partial<NotificationAttributes>,
    options?: SqlizeOptions
  ): Promise<NotificationInstance> {
    const data = await this.findByPk(id, { lang: options?.lang })

    const value = useValidation(notificationSchema.create, {
      ...data.toJSON(),
      ...formData,
    })

    await data.update(value ?? {}, { transaction: options?.transaction })

    return data
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
    const isForce = validateBoolean(options?.force)

    const data = await this.findByPk(id, { lang: options?.lang })
    await data.destroy({ force: isForce })
  }

  /**
   *
   * @param id
   * @param options
   */
  public static async restore(
    id: string,
    options?: SqlizeOptions
  ): Promise<void> {
    const data = await this.findByPk(id, {
      paranoid: false,
      lang: options?.lang,
    })

    await data.restore()
  }

  /**
   *
   * @param ids @example ids = ["id_1", "id_2"]
   * @param options
   */
  public static async multipleDelete(
    ids: string[],
    options?: SqlizeOptions
  ): Promise<void> {
    const i18nOpt: string | TOptions = { lng: options?.lang }
    const isForce = validateBoolean(options?.force)

    if (_.isEmpty(ids)) {
      const message = i18nConfig.t('errors.cantBeEmpty', i18nOpt)
      throw new ResponseError.BadRequest(`ids ${message}`)
    }

    await Notification.destroy({
      where: { id: { [Op.in]: ids } },
      force: isForce,
    })
  }

  /**
   *
   * @param ids @example ids = ["id_1", "id_2"]
   * @param options
   */
  public static async multipleRestore(
    ids: string[],
    options?: SqlizeOptions
  ): Promise<void> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    if (_.isEmpty(ids)) {
      const message = i18nConfig.t('errors.cantBeEmpty', i18nOpt)
      throw new ResponseError.BadRequest(`ids ${message}`)
    }

    await Notification.restore({
      where: { id: { [Op.in]: ids } },
    })
  }

  /**
   * Send Notification
   */
  public static async sendNotification(): Promise<void> {
    const getNotification = await Notification.findOne({
      where: {
        isRead: false,
        isSend: false,
        sendAt: {
          [Op.and]: [
            { [Op.gte]: startOfDay(new Date()) },
            { [Op.lt]: new Date() },
          ],
        },
      },
    })

    if (getNotification) {
      // update notification
      await getNotification.update({ isSend: true })

      // check user id = null ( if user id null = send all notif to all user )
      if (_.isEmpty(getNotification.UserId)) {
        // FCM Token from get All
        const limitPushNotif = 200
        const getFcmToken = await FcmTokenService.getToken()

        // loop array chunk
        if (!_.isEmpty(getFcmToken)) {
          const newArrayToken = _.chunk(getFcmToken, limitPushNotif)

          // limit send notif to 100 user
          for (let i = 0; i < newArrayToken.length; i += 1) {
            const itemToken = newArrayToken[i]

            // check token fcm != null
            if (!_.isEmpty(itemToken)) {
              const dataFCM = await FCMHelper.sendMulticast({
                deviceTokens: itemToken,
                title: getNotification?.title,
                message: getNotification?.text,
                type: getNotification?.type,
                data: JSON.stringify(getNotification),
              })

              console.log(chalk.cyan('sending all notification...'), dataFCM)
            }
          }
        }
      } else {
        // get fcm token by user
        const getFcmToken = await FcmTokenService.findByUser(
          String(getNotification.UserId),
          { lang: 'en' }
        )

        // check token fcm != null
        if (!_.isEmpty(getFcmToken.token)) {
          const dataFCM = await FCMHelper.sendToDevice({
            deviceTokens: [getFcmToken.token],
            title: getNotification.title,
            message: getNotification.text,
            type: getNotification.type,
            data: JSON.stringify(getNotification),
          })

          console.log(
            chalk.cyan('sending to user notification...'),
            dataFCM.results
          )
        }
      }
    }
  }
}

export default NotificationService
