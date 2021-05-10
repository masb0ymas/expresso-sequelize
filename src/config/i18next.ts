import i18next from 'i18next'
import i18nextBackend from 'i18next-fs-backend'

i18next.use(i18nextBackend).init(
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
  (err, t) => {
    if (err) return console.error(err)
    console.log('i18next is ready...')
  }
)

export default i18next
