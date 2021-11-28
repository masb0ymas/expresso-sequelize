import { Request } from 'express'

const invalidPlatform = ['', null, 'null', undefined, 'undefined', 'unknown']

class userAgentHelper {
  /**
   *
   * @param req
   * @returns {string}
   */
  public static currentDevice(req: Request): string {
    const { useragent } = req

    const checkMobileAccess =
      useragent?.isMobile ??
      useragent?.isBlackberry ??
      useragent?.isAndroid ??
      useragent?.isiPhone ??
      useragent?.isWindowsPhone

    const checkTabletAccess =
      useragent?.isTablet ?? useragent?.isAndroidTablet ?? useragent?.isiPad

    const checkDesktopAccess =
      useragent?.isDesktop ??
      useragent?.isChromeOS ??
      useragent?.isLinux ??
      useragent?.isLinux64 ??
      useragent?.isWindows ??
      useragent?.isMac

    let device = null

    if (checkTabletAccess) {
      device = 'Tablet'
    } else if (checkMobileAccess) {
      device = 'Mobile'
    } else if (useragent?.isSmartTV) {
      device = 'Smart TV'
    } else if (checkDesktopAccess) {
      device = 'Desktop'
    } else if (useragent?.isSamsung) {
      device = 'Samsung'
    } else {
      device = 'unkown'
    }

    return device
  }

  /**
   *
   * @param req
   * @returns {string}
   */
  public static currentPlatform(req: Request): string {
    const { useragent } = req

    let currentOS = null

    if (invalidPlatform.includes(useragent?.os)) {
      currentOS = this.currentDevice(req)
    } else {
      currentOS = useragent?.os
    }

    const platform = `${currentOS} - ${useragent?.platform}`

    return platform
  }
}

export default userAgentHelper
