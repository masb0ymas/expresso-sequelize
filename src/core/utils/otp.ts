import { ms } from 'expresso-core'
import { useOTP } from 'expresso-hooks'
import { type TOptions } from 'i18next'
import { env } from '~/config/env'
import { i18n } from '~/config/i18n'
import { redisService } from '~/config/redis'
import { type IReqOptions } from '../interface/ReqOptions'
import ResponseError from '../modules/response/ResponseError'

interface HashOTPEntity {
  phone: string
  otp: string | number
}

export class OTP {
  private static readonly _useOTP = new useOTP()
  private static readonly _secretKey = env.SECRET_OTP
  private static readonly _expires = env.EXPIRED_OTP

  /**
   *
   * @param payload
   * @returns
   */
  public static hash(payload: string): string {
    const result = this._useOTP.hash(payload, { secretKey: this._secretKey })

    return result
  }

  /**
   *
   * @param payload
   * @returns
   */
  public static hashOTP(payload: string): string {
    const result = this._useOTP.hashOTP(payload, {
      expires: this._expires,
      secretKey: this._secretKey,
    })

    return result
  }

  /**
   *
   * @param payload
   * @param hash
   * @returns
   */
  public static compare(payload: string, hash: string): boolean {
    const result = this._useOTP.compare(payload, hash, {
      secretKey: this._secretKey,
    })

    return result
  }

  /**
   *
   * @param payload
   * @param hash
   * @returns
   */
  public static verifyHash(payload: string, hash: string): boolean {
    const result = this._useOTP.verifyHash(payload, hash, {
      secretKey: this._secretKey,
    })

    return result
  }

  /**
   *
   * @param params
   * @param options
   */
  public static async takeOver(
    params: HashOTPEntity,
    options?: IReqOptions
  ): Promise<void> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    const { phone, otp } = params

    const keyRedis = `${phone}`
    const expires = ms('10m')
    const limit = 5

    const getRedis: string | null = await redisService.get(keyRedis)

    let storeRedis = []

    // Get Cache
    if (!getRedis) {
      storeRedis = [otp]
    } else {
      storeRedis = [...getRedis, otp]
    }

    // Check Takeover Verify OTP
    if (storeRedis.length >= limit) {
      const message = i18n.t('errors.login_back', i18nOpt)
      throw new ResponseError.BadRequest(message)
    }

    console.log({ storeRedis })

    // Set Redis
    await redisService.set(keyRedis, JSON.stringify(storeRedis), {
      timeout: expires,
    })
  }
}
