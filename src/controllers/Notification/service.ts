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
import { DtoFindAll } from '@expresso/modules/SqlizeQuery/interface'
import PluginSqlizeQuery from '@expresso/modules/SqlizeQuery/PluginSqlizeQuery'
import chalk from 'chalk'
import { startOfDay } from 'date-fns'
import { Request } from 'express'
import _ from 'lodash'
import { Includeable, Order, Transaction } from 'sequelize'
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

    return { message: `${total} data has been received.`, data, total }
  }

  /**
   *
   * @param id
   * @param options
   * @returns
   */
  public static async findByPk(
    id: string,
    options?: {
      include?: Includeable | Includeable[]
      order?: Order
      paranoid?: boolean
    }
  ): Promise<NotificationInstance> {
    const newId = validateUUID(id)
    const data = await Notification.findByPk(newId, {
      include: options?.include,
      order: options?.order,
      paranoid: options?.paranoid,
    })

    if (!data) {
      throw new ResponseError.NotFound(
        'notification data not found or has been deleted'
      )
    }

    return data
  }

  /**
   *
   * @param id
   * @param paranoid
   * @returns
   */
  public static async findById(
    id: string,
    paranoid?: boolean
  ): Promise<NotificationInstance> {
    const data = await this.findByPk(id, { paranoid })

    return data
  }

  /**
   *
   * @param formData
   * @param txn
   * @returns
   */
  public static async create(
    formData: NotificationAttributes,
    txn?: Transaction
  ): Promise<NotificationInstance> {
    const value = useValidation(notificationSchema.create, formData)
    const data = await Notification.create(value, { transaction: txn })

    return data
  }

  /**
   *
   * @param id
   * @param formData
   * @param txn
   * @returns
   */
  public static async update(
    id: string,
    formData: Partial<NotificationAttributes>,
    txn?: Transaction
  ): Promise<NotificationInstance> {
    const data = await this.findByPk(id)

    const value = useValidation(notificationSchema.create, {
      ...data.toJSON(),
      ...formData,
    })

    await data.update(value ?? {}, { transaction: txn })

    return data
  }

  /**
   *
   * @param id
   * @param force
   */
  public static async delete(id: string, force?: boolean): Promise<void> {
    const isForce = validateBoolean(force)

    const data = await this.findByPk(id)
    await data.destroy({ force: isForce })
  }

  /**
   *
   * @param id
   */
  public static async restore(id: string): Promise<void> {
    const data = await this.findByPk(id, { paranoid: false })

    await data.restore()
  }

  /**
   *
   * @param ids @example ids = ["id_1", "id_2"]
   * @param force
   */
  public static async multipleDelete(
    ids: string[],
    force?: boolean
  ): Promise<void> {
    const isForce = validateBoolean(force)

    if (_.isEmpty(ids)) {
      throw new ResponseError.BadRequest('ids cannot be empty')
    }

    await Notification.destroy({
      where: { id: { [Op.in]: ids } },
      force: isForce,
    })
  }

  /**
   *
   * @param ids @example ids = ["id_1", "id_2"]
   */
  public static async multipleRestore(ids: string[]): Promise<void> {
    if (_.isEmpty(ids)) {
      throw new ResponseError.BadRequest('ids cannot be empty')
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
          String(getNotification.UserId)
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
