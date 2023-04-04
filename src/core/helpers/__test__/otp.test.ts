import { describe, test, expect } from '@jest/globals'
import Redis from 'ioredis-mock'
import { createHashOTP, takeOverOTP, verifyHashOTP } from '../otp'

const redis = new Redis()

describe('helpers OTP Test', () => {
  test('should create hash otp', () => {
    const anyPhone = '081234567890'
    const anyOTP = '123456'

    const data = createHashOTP({ phone: anyPhone, otp: anyOTP })

    expect(data).not.toBeNull()
  })

  test('should create hash otp with length value', () => {
    const anyPhone = '081234567890'
    const anyOTP = '123456'

    const data = createHashOTP({ phone: anyPhone, otp: anyOTP })
    const splitData = data.split('.')

    expect(splitData).toHaveLength(2)
  })

  test('should verify hash otp', () => {
    const anyPhone = '081234567890'
    const anyOTP = '123456'

    const hashOTP = createHashOTP({ phone: anyPhone, otp: anyOTP })

    const verifyHash = verifyHashOTP({
      phone: anyPhone,
      otp: anyOTP,
      hash: hashOTP,
    })

    expect(verifyHash).toBe(true)
  })

  test('should take over otp with throw error', async () => {
    const anyPhone = '081234567890'
    const anyOTP = '123456'
    const wrongOTP = '112233'

    const anyValue = []

    for (let i = 0; i < 6; i += 1) {
      anyValue.push(wrongOTP)
    }

    await redis.set(`${anyPhone}`, JSON.stringify(anyValue))

    await expect(async () => {
      await takeOverOTP({ phone: anyPhone, otp: anyOTP })
    }).rejects.toThrow(
      'you have entered the wrong otp, please try again in 10 minutes'
    )
  })
})
