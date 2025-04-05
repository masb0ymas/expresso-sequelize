import { NextFunction, Request, Response } from 'express'
import { Details } from 'express-useragent'

export type UserAgentState = {
  browser: string
  version: string
  os: string
  platform: string
  geoIp: string
  source: string
  is: string[]
  device: string
}

export default function expressUserAgent() {
  return (req: Request, _res: Response, next: NextFunction) => {
    // check is user agent
    const userAgentIs = (useragent: Details | any): string[] => {
      const r = []
      for (const i in useragent) if (useragent[i] === true) r.push(i)
      return r
    }

    // set user agent
    const userAgentState = {
      browser: req.useragent?.browser,
      version: req.useragent?.version,
      device: `${req.useragent?.platform} ${req.useragent?.os} - ${req.useragent?.browser} ${req.useragent?.version}`,
      os: req.useragent?.os,
      platform: req.useragent?.platform,
      geoIp: req.useragent?.geoIp,
      source: req.useragent?.source,
      is: userAgentIs(req.useragent),
    }

    // set client ip
    const clientIp = req.clientIp?.replace(/\s/g, '').replace(/::1|::ffff:/g, '127.0.0.1')

    req.setState({ userAgent: userAgentState, clientIp })
    next()
  }
}
