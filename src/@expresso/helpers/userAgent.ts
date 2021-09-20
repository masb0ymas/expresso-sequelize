import { Request } from 'express'

class userAgentHelper {
  /**
   *
   * @param req
   * @returns
   */
  public static currentDevice(req: Request): string | null {
    const { useragent } = req

    let device = null

    if (
      useragent?.isTablet ??
      useragent?.isAndroidTablet ??
      useragent?.isiPad
    ) {
      device = 'Tablet'
    } else if (useragent?.isMobile ?? useragent?.isBlackberry) {
      device = 'Mobile'
    } else if (useragent?.isSmartTV) {
      device = 'Smart TV'
    } else if (useragent?.isDesktop) {
      device = 'Desktop'
    }

    return device
  }

  /**
   *
   * @param req
   * @returns
   */
  public static currentPlatform(req: Request): string {
    const { useragent } = req

    let currentOS = null

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
