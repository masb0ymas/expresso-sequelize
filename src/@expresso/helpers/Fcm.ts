import * as admin from 'firebase-admin'

interface sendToMessageAttributes {
  title: string
  message: string
  type: string
  data: string
}

interface sendMulticastAttributes extends sendToMessageAttributes {
  deviceTokens: string[]
}

const defaultTitle = 'expresso'
const clickAction = 'REACT_NOTIFICATION_CLICK'

// Firebase Cloud Messaging
class FCMHelper {
  /**
   *
   * @param values
   * @returns
   */
  public static async sendMulticast(
    values: sendMulticastAttributes
  ): Promise<admin.messaging.BatchResponse> {
    const { deviceTokens, title, message, type, data: jsonData } = values

    const data = await admin.messaging().sendMulticast({
      tokens: deviceTokens,
      notification: { title: title ?? defaultTitle, body: message },
      data: { click_action: clickAction, type, data: jsonData },
    })

    return data
  }

  /**
   *
   * @param values
   * @returns
   */
  public static async sendToDevice(
    values: sendMulticastAttributes
  ): Promise<admin.messaging.MessagingDevicesResponse> {
    const { deviceTokens, title, message, type, data: jsonData } = values

    const data = await admin.messaging().sendToDevice(deviceTokens, {
      notification: { title: title ?? defaultTitle, body: message },
      data: { click_action: clickAction, type, data: jsonData },
    })

    return data
  }

  /**
   *
   * @param values
   * @returns
   */
  public static async sendTopics(
    values: sendToMessageAttributes
  ): Promise<string> {
    const { title, message, type, data: jsonData } = values

    const data = await admin.messaging().send({
      topic: 'all',
      notification: { title: title ?? defaultTitle, body: message },
      data: { click_action: clickAction, type, data: jsonData },
    })

    return data
  }
}

export default FCMHelper
