import { Request } from 'express'

class userAgentHelper {
  /**
   *
   * @param req - Request
   */
  public static currentDevice(req: Request) {
    const { useragent } = req

    if (useragent?.isDesktop) {
      const device = 'Desktop'
      return device
    }

    if (
      useragent?.isTablet ||
      useragent?.isAndroidTablet ||
      useragent?.isiPad
    ) {
      const device = 'Tablet'
      return device
    }

    if (useragent?.isMobile || useragent?.isBlackberry) {
      const device = 'Mobile'
      return device
    }

    if (useragent?.isSmartTV) {
      const device = 'Smart TV'
      return device
    }

    return null
  }

  /**
   *
   * @param req - Request
   */
  public static currentPlatform(req: Request) {
    const { useragent } = req

    let currentOS

    if (useragent?.os === 'unkown') {
      currentOS = this.currentDevice(req)
    } else {
      currentOS = useragent?.os
    }

    const platform = `${currentOS} - ${useragent?.platform}`

    return platform
  }
}

export default userAgentHelper
