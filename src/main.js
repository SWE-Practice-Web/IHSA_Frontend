import { createApp } from 'vue'
import App from './App.vue'
import VueGoogleMaps from '@fawmi/vue-google-maps'

const app = createApp(App)

app.use(VueGoogleMaps, {
    load: {
        key:  process.env.VUE_APP_GOOGLE_MAPS_API_KEY,
        language: 'en',
    },
}).mount('#app')
