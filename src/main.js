import { createApp } from 'vue'
import App from './App.vue'
import {store} from './store'
import * as VueRouter from "vue-router"
import OpenLayersMap from 'vue3-openlayers'
import Notifications from '@kyvg/vue3-notification'
import 'vue3-openlayers/dist/vue3-openlayers.css'
import "bootstrap/dist/css/bootstrap.min.css"
import 'bootstrap';
import HomePage from "./views/HomePage.vue"
import MapContainer from "./components/MapContainer.vue"
import LoginPage from "./views/LoginPage.vue"
import SignupPage from "./views/SignupPage.vue"
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTriangleExclamation, faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faTriangleExclamation)
library.add(faCircleInfo)
import AnnouncementPage from "./views/AnnouncementPage.vue"
import ManageHorsePage from "./views/ManageHorsePage.vue"
import ManageEventPage from "./views/admin/ManageEventPage.vue"
import manageEventRiders from "./components/manageEventRiders.vue"
import manageEventHorses from "./components/manageEventHorses.vue"
import manageEventClasses from "./components/manageEventClasses.vue"
import ManagePermissions from "./views/admin/ManagePermissions.vue"
import axios from 'axios'
import ManageRiderPage from "./views/ManageRiderPage.vue"


const routes = [
    { path: '/', component: HomePage },
    { path: '/map', component: MapContainer },
    { path: '/login', component: LoginPage },
    { path: '/signup', component: SignupPage },
    { path: '/announcements', component: AnnouncementPage },
    { path: '/eventRiders', component: manageEventRiders },
    { path: '/eventHorses', component: manageEventHorses },
    { path: '/eventClasses', component: manageEventClasses },
    { path: '/manage', component: ManageEventPage },
    { path: '/hManage', component: ManageHorsePage },
    { path: '/permissions', component: ManagePermissions },
    { path: '/rManage', component: ManageRiderPage },
  ]

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes,
})

const app = createApp(App);
const axiosInstance = axios.create({
  // baseURL: process.env.VUE_APP_BASE_URL,
  baseURL: "https://localhost:49191",
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