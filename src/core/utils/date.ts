import { format } from 'date-fns'
import { id } from 'date-fns/locale'

const TZ_ID = { locale: id }

/**
 *
 * @param value
 * @param formatStr
 * @returns
 */
export function formatDate(value: string | number | Date, formatStr: string) {
  return format(new Date(value), formatStr, TZ_ID)
}

/**
 *
 * @param value
 * @returns
 */
export function formatDateTime(value: string | number | Date): string {
  const formatString = 'dd-MM-yyyy HH:mm:ss'
  return formatDate(value, formatString)
}
