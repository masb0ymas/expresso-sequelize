import { afterAll, describe, expect, test } from '@jest/globals'
import { validateUUID } from '../formatter'

describe('helpers formatter test', () => {
  afterAll(async () => {
    await new Promise<void>((resolve) =>
      setTimeout(() => {
        resolve()
      }, 500)
    ) // avoid jest open handle error
  })

  test('should validate uuid with wrong value', () => {
    const anyValue = 'anyUUIDValue'
    const expectValue = 'errors.incorrect_uuid_format'

    expect(() => validateUUID(anyValue)).toThrow(expectValue)
  })

  test('should validate uuid', () => {
    const anyValue = '718f7287-1eae-431c-a532-873fd2080799'

    const data = validateUUID(anyValue)

    expect(data).toBe(anyValue)
  })
})
