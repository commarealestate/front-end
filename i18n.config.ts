// import en from './locales/en.json';
// import ar from './locales/ar.json';
// export default defineI18nConfig(() => ({
//     locale: 'en',
//     messages: {
//       ar,
//       en
//     }
// }))
import en from './locales/en.json';
import ar from './locales/ar.json';

export default defineI18nConfig(() => ({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    ar,
    en
  }
}))
