import { createApp } from 'vue'
import App from './App.vue'
import { Quasar,  Dialog , Loading, Notify} from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'
import router from './router'
import { createPinia } from 'pinia'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(Quasar, {
    plugins: {
        Dialog,
        Loading,
        Notify
    }, // import Quasar plugins and add here
  })

app.mount('#app')
