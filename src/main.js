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
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faTriangleExclamation)
import AnnouncementPage from "./views/AnnouncementPage.vue"
import ManageEventPage from "./views/admin/ManageEventPage.vue"

const routes = [
    { path: '/', component: HomePage },
    { path: '/map', component: MapContainer },
    { path: '/login', component: LoginPage },
    { path: '/signup', component: SignupPage },
    { path: '/announcements', component: AnnouncementPage },
    { path: '/manage', component: ManageEventPage },
  ]

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes,
})

const app = createApp(App);

app.use(OpenLayersMap)
app.use(router)
app.use(store)
app.use(Notifications)
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')