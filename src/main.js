import { createApp } from 'vue'
import App from './App.vue'
import * as VueRouter from "vue-router"
import OpenLayersMap from 'vue3-openlayers'
import 'vue3-openlayers/dist/vue3-openlayers.css'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import HomePage from "./views/HomePage.vue"
import MapContainer from "./components/MapContainer.vue"
import LoginPage from "./views/LoginPage.vue"
import SignupPage from "./views/SignupPage.vue"
import AnnouncementPage from "./views/AnnouncementPage.vue"

const routes = [
    { path: '/', component: HomePage },
    { path: '/map', component: MapContainer },
    { path: '/login', component: LoginPage },
    { path: '/signup', component: SignupPage },
    { path: '/announcements', component: AnnouncementPage },
  ]

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes,
})

const app = createApp(App);

app.use(OpenLayersMap)
app.use(router)

app.mount('#app')