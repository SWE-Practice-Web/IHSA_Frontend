import { createApp } from 'vue'
import App from './App.vue'
import * as VueRouter from "vue-router"
import OpenLayersMap from 'vue3-openlayers'
import 'vue3-openlayers/dist/vue3-openlayers.css'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import HomePage from "./views/HomePage.vue"
import MapContainer from "./components/MapContainer.vue"
import manageEventRiders from "./components/manageEventRiders.vue"
import manageEventHorses from "./components/manageEventHorses.vue"
import manageEventClasses from "./components/manageEventClasses.vue"
import LoginPage from "./views/LoginPage.vue"
import SignupPage from "./views/SignupPage.vue"
import { library } from '@fortawesome/fontawesome-svg-core'
import { faChevronCircleDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faChevronCircleDown)

const routes = [
    { path: '/', component: HomePage },
    { path: '/map', component: MapContainer },
    { path: '/login', component: LoginPage },
    { path: '/signup', component: SignupPage },
    { path: '/eventRiders', component: manageEventRiders },
    { path: '/eventHorses', component: manageEventHorses },
    { path: '/eventClasses', component: manageEventClasses },
  ]

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes,
})

const app = createApp(App);

app.use(OpenLayersMap)
app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)
app.config.globalProperties.eventRiders = { 'Class 11': [], 'Class 12A': [], 'Class 12B': [], 'Class 13': [], 'Class 14': [], 'Class 15': [], 'Class 16': [], 'Class 17': [] }
app.config.globalProperties.eventHorses = { 'Class 11': [], 'Class 12A': [], 'Class 12B': [], 'Class 13': [], 'Class 14': [], 'Class 15': [], 'Class 16': [], 'Class 17': [] }
app.config.globalProperties.eventClasses = { 'Class 11': [], 'Class 12A': [], 'Class 12B': [], 'Class 13': [], 'Class 14': [], 'Class 15': [], 'Class 16': [], 'Class 17': [] }

app.mount('#app')