import { format } from 'date-fns'
import { id } from 'date-fns/locale'

const TZ_ID = { locale: id } // Timezone Indonesia

const formatDate = (date: Date | number | string) => {
  return format(new Date(date), 'dd-MM-yyyy', TZ_ID)
}

const formatDateTime = (date: Date | number | string) => {
  return format(new Date(date), 'dd-MM-yyyy HH:mm:ss', TZ_ID)
}

const formatDateSystem = (date: Date | number | string) => {
  return format(new Date(date), 'yyyy-MM-dd', TZ_ID)
}

const formatDateTimeSystem = (date: Date | number | string) => {
  return format(new Date(date), 'yyyy-MM-dd HH:mm:ss', TZ_ID)
}

const formatMonth = (date: Date | number | string) => {
  return format(new Date(date), 'MMMM', TZ_ID)
}

const formatYear = (date: Date | number | string) => {
  return format(new Date(date), 'yyyy', TZ_ID)
}

const formatTime = (date: Date | number | string) => {
  return format(new Date(date), 'HH:mm:ss', TZ_ID)
}

export {
  formatDate,
  formatDateSystem,
  formatDateTime,
  formatDateTimeSystem,
  formatMonth,
  formatYear,
  formatTime,
}
