import { createApp } from 'vue'
import App from './App.vue'
import OpenLayersMap from 'vue3-openlayers'
import Notifications from '@kyvg/vue3-notification'
import 'vue3-openlayers/dist/vue3-openlayers.css'
import "bootstrap/dist/css/bootstrap.min.css"
import 'bootstrap';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTriangleExclamation, faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faTriangleExclamation)
library.add(faCircleInfo)
import axios from 'axios'
import router from './router'
import store from './store'



const app = createApp(App);
const axiosInstance = axios.create({
  // baseURL: process.env.VUE_APP_BASE_URL,
  baseURL: "https://localhost:5001",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
})

app.config.globalProperties.$axios = { ...axiosInstance }
app.use(OpenLayersMap)
app.use(router)
app.use(store)
app.use(Notifications)
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
