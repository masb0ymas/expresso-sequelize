import crypto from 'crypto'
import ms from 'ms'

const { SECRET_OTP, EXPIRED_OTP }: any = process.env

type HashOTPAttributes = {
  phone: string
  otp: string | number
  hash?: string
}

export function createHashOTP(params: HashOTPAttributes) {
  const { phone, otp } = params

  const ttl = ms(EXPIRED_OTP) // 5 Minutes in miliseconds
  const expires = Date.now() + ttl // timestamp to 5 minutes in the future
  const data = `${phone}.${otp}.${expires}` // phone.otp.expiry_timestamp

  const hash = crypto
    .createHmac('sha256', SECRET_OTP)
    .update(data)
    .digest('hex') // creating SHA256 hash of the data
  const fullHash = `${hash}.${expires}` // Hash.expires, format to send to the user

  return fullHash
}

export function verifyHashOTP(params: HashOTPAttributes) {
  const { phone, otp, hash } = params
  // @ts-ignore
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
