import { format } from 'date-fns'
import { id } from 'date-fns/locale'

const TZ_ID = { locale: id } // Timezone Indonesia

/**
 *
 * @param date
 * @returns
 */
export const formatDate = (date: Date | number | string): string => {
  return format(new Date(date), 'dd-MM-yyyy', TZ_ID)
}

/**
 *
 * @param date
 * @returns
 */
export const formatDateTime = (date: Date | number | string): string => {
  return format(new Date(date), 'dd-MM-yyyy HH:mm:ss', TZ_ID)
}
