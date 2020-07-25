import { format } from 'date-fns'
import { id } from 'date-fns/locale'

const timezoneIndonesia = { locale: id }

const formatDate = (date: Date | number | string) => {
  return format(new Date(date), 'dd-MM-yyyy', timezoneIndonesia)
}

const formatDateTime = (date: Date | number | string) => {
  return format(new Date(date), 'dd-MM-yyyy HH:mm:ss', timezoneIndonesia)
}

const formatDateSystem = (date: Date | number | string) => {
  return format(new Date(date), 'yyyy-MM-dd', timezoneIndonesia)
}

const formatDateTimeSystem = (date: Date | number | string) => {
  return format(new Date(date), 'yyyy-MM-dd HH:mm:ss', timezoneIndonesia)
}

const formatMonth = (date: Date | number | string) => {
  return format(new Date(date), 'MMMM', timezoneIndonesia)
}

const formatYear = (date: Date | number | string) => {
  return format(new Date(date), 'yyyy', timezoneIndonesia)
}

const formatTime = (date: Date | number | string) => {
  return format(new Date(date), 'HH:mm:ss', timezoneIndonesia)
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
