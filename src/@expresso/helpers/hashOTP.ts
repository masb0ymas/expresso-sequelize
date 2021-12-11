import { EXPIRED_OTP, SECRET_OTP } from '@config/env'
import crypto from 'crypto'
import ms from 'ms'

interface HashOTPAttributes {
  phone: string
  otp: string | number
}

interface VerifyHashOTPAttributes extends HashOTPAttributes {
  hash: string
}

/**
 * Generate Random OTP
 * @returns {string}
 */
export function getRandomOTP(): string {
  // which stores all digits
  const digits = '0123456789'
  let OTP = ''

  for (let i = 0; i < 6; i += 1) {
    OTP += digits[Math.floor(Math.random() * 10)]
  }

  return OTP
}

/**
 *
 * @param params {HashOTPAttributes}
 * @returns {string}
 */
export function createHashOTP(params: HashOTPAttributes): string {
  const { phone, otp } = params

  const ttl = ms(EXPIRED_OTP) // 5 Minutes in miliseconds
  const expires = Date.now() + Number(ttl) // timestamp to 5 minutes in the future
  const data = `${phone}.${otp}.${expires}` // phone.otp.expiry_timestamp

  const hash = crypto
    .createHmac('sha256', SECRET_OTP)
    .update(data)
    .digest('hex') // creating SHA256 hash of the data
  const resultHash = `${hash}.${expires}` // Hash.expires, format to send to the user

  return resultHash
}

/**
 *
 * @param params {VerifyHashOTPAttributes}
 * @returns {boolean}
 */
export function verifyHashOTP(params: VerifyHashOTPAttributes): boolean {
  const { phone, otp, hash } = params
  const [hashValue, expires] = hash.split('.')

  // Check if expiry time has passed
  const now = Date.now()
  if (now > parseInt(expires)) return false

  // Calculate new hash with the same key and the same algorithm
  const data = `${phone}.${otp}.${expires}`
  const newHash = crypto
    .createHmac('sha256', SECRET_OTP)
    .update(data)
    .digest('hex')

  // Match the hashes
  if (newHash === hashValue) {
    return true
  }

  return false
}
