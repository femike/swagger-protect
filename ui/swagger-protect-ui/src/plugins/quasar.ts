import '@quasar/extras/roboto-font/roboto-font.css'
import 'quasar/dist/quasar.prod.css'

import { Cookies, Notify, Quasar } from 'quasar'
import type { App } from 'vue'

export function createQuasar(app: App) {
  app.use(Quasar, {
    plugins: {
      Notify,
      Cookies,
    },
    lang: Quasar.lang.getLocale(),
    config: {
      brand: {},
      notify: {
        position: 'top',
        progress: true,
      },
    },
  })

  return app
}

export default createQuasar
