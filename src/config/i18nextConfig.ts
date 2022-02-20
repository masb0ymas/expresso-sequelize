import { logServer } from '@expresso/helpers/Formatter'
import i18next from 'i18next'
import i18nextBackend from 'i18next-fs-backend'

void i18next.use(i18nextBackend).init(
  {
    lng: 'en',
    fallbackLng: 'en',
    preload: ['en', 'id'],
    ns: ['translation'],
    defaultNS: 'translation',
    backend: {
      loadPath: 'public/locales/{{lng}}/{{ns}}.json',
    },
  },
  (err, _t) => {
    if (err) return console.error(err)

    console.log(logServer('i18next', 'is ready...'))
  }
)

const i18nConfig = i18next

export { i18nConfig }
