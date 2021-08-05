import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createQuasar, createI18N } from './plugins'

let app = createApp(App)
app.use(router)
app = createQuasar(app)
createI18N(app)
app.mount('#app')
