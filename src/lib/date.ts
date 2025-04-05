export function ms(value: string): number {
  const TIME_UNITS = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
    w: 7 * 24 * 60 * 60 * 1000,
  }

  const type = value.slice(-1)
  const numericValue = parseInt(value.slice(0, -1), 10)

  if (isNaN(numericValue) || !(type in TIME_UNITS)) {
    throw new Error('Invalid time format')
  }

  // @ts-expect-error
  return numericValue * TIME_UNITS[type]
}
