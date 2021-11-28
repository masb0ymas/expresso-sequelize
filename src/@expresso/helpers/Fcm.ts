import * as admin from 'firebase-admin'

interface sendToDevicesProps {
  title: string
  deviceTokens: string[]
  message: string
  type: string
  data: string
}

interface sendToMessageProps {
  title: string
  message: string
  type: string
  data: string
}

const title = 'expresso'
const clickAction = 'REACT_NOTIFICATION_CLICK'

// Firebase Cloud Messaging
class FCMHelper {
  /**
   *
   * @param props {sendToDevicesProps}
   * @returns
   */
  public static async sendToDevices(
    props: sendToDevicesProps
  ): Promise<admin.messaging.BatchResponse> {
    const message = {
      tokens: props.deviceTokens,
      notification: {
        title: props.title || title,
        body: props.message,
      },
      data: {
        click_action: clickAction,
        type: props.type,
        data: props.data,
      },
    }

    const data = await admin.messaging().sendMulticast(message)

    return data
  }

  /**
   *
   * @param props {sendToMessageProps}
   * @returns
   */
  public static async sendToAll(props: sendToMessageProps): Promise<string> {
    const message = {
      topic: 'all',
      notification: {
        title: props.title || title,
        body: props.message,
      },
      data: {
        click_action: clickAction,
        type: props.type,
        data: props.data,
      },
    }

    const data = await admin.messaging().send(message)

    return data
  }
}

export default FCMHelper
