import { describe, test, expect } from '@jest/globals'
import { generateToken, verifyToken } from '../token'

describe('helpers token test', () => {
  test('should generate token', () => {
    const anyValue = { uid: '3859acb9-c7b7-4273-b239-02dcf1e1fcb5' }

    const data = generateToken(anyValue)

    expect(data.token).not.toBeNull()
  })

  test('should verify token', () => {
    const anyValue = { uid: '3859acb9-c7b7-4273-b239-02dcf1e1fcb5' }
    const data = generateToken(anyValue)

    const result = verifyToken(data.token)

    expect(result?.data).not.toBeNull()
  })
})
