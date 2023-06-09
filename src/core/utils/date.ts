import { addHours, format, intervalToDuration, startOfDay } from 'date-fns'
import { id } from 'date-fns/locale'

const TZ_ID = { locale: id }

/**
 *
 * @param value
 * @returns
 */
export function formatDate(value: string | number | Date): string {
  return format(new Date(value), 'dd-MM-yyyy', TZ_ID)
}

/**
 *
 * @param value
 * @returns
 */
export function formatDateTime(value: string | number | Date): string {
  return format(new Date(value), 'dd-MM-yyyy HH:mm:ss', TZ_ID)
}

/**
 * Convert Date To Excel Number Date
 * @param value
 * @returns
 */
export const dateToNumber = (value: string | number | Date): number => {
  const getDate = new Date(value)

  const localTime = getDate.getTime() - getDate.getTimezoneOffset() * 60 * 1000
  const converted = 25569.0 + localTime / (1000 * 60 * 60 * 24)

  return converted
}

/**
 * Convert Excel Number Date To Javascript Date
 * @param value
 * @returns
 */
export const convertDateExcelNumber = (value: number): Date => {
  const getDate = new Date(Math.round(value - 25569.0) * (1000 * 60 * 60 * 24))

  // UTC +7
  const dateFromUTC = addHours(getDate, 7)
  const result = startOfDay(dateFromUTC)

  return result
}

/**
 *
 * @param value
 * @returns
 */
export const convertDateExcel = (value: string | number | Date): Date => {
  const getDate = new Date(value)

  // UTC +7
  const dateFromUTC = addHours(getDate, 7)
  const result = startOfDay(dateFromUTC)

  return result
}

/**
 *
 * @param startDate
 * @param endDate
 * @returns
 */
export const calculateAge = (startDate: Date, endDate?: Date): number => {
  const newEndDate = endDate instanceof Date ? endDate : new Date()

  const interval = intervalToDuration({
    start: new Date(startDate),
    end: new Date(newEndDate),
  })

  return interval.years ? interval.years : 0
}

/**
 *
 * @param startDate
 * @param endDate
 * @returns
 */
export const calculateParseAge = (startDate: Date, endDate?: Date): string => {
  const newEndDate = endDate instanceof Date ? endDate : new Date()

  const interval = intervalToDuration({
    start: new Date(startDate),
    end: new Date(newEndDate),
  })

  const result = `${interval.years} years, ${interval.months} months, ${interval.days} days`
  return result
}
