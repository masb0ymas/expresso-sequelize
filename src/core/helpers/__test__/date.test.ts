import { describe, test, expect } from '@jest/globals'
import { formatDate, formatDateTime } from '../date'

describe('helpers date test', () => {
  test('should format date', () => {
    const anyValue = '02-11-2023'
    const expectValue = '11-02-2023'

    const data = formatDate(anyValue)

    expect(data).toEqual(expectValue)
  })

  test('should format date time', () => {
    const anyValue = '02-11-2023'
    const expectValue = '11-02-2023 00:00:00'

    const data = formatDateTime(anyValue)

    expect(data).toEqual(expectValue)
  })
})
