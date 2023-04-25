import * as VueRouter from "vue-router";
import HomePage from "./views/general/HomePage.vue"
import MapContainer from "./views/general/MapPage.vue"
import LoginPage from "./views/auth/LoginPage.vue"
import SignupPage from "./views/auth/SignupPage.vue"
import AnnouncementPage from "./views/general/AnnouncementPage.vue"
import ManageHorsePage from "./views/admin/ManageHorsePage.vue"
import ManageEventPage from "./views/admin/ManageEventPage.vue"
import ManagePermissions from "./views/admin/ManagePermissionsPage.vue"
import ManageRiderPage from "./views/admin/ManageRiderPage.vue"
import { store } from './store'
const numToRole = store.state.numToRole
const role = numToRole[store.state.numToRole]

function isAdmin() {
    return role == "admin"
}

const routes = [
  { path: "/", component: HomePage },
  { path: "/map", component: MapContainer },
  { path: "/login", component: LoginPage },
  { path: "/signup", component: SignupPage },
  { path: "/announcements", component: AnnouncementPage },
  { path: "/manage", component: ManageEventPage, beforeEnter: [isAdmin] },
  { path: "/hManage", component: ManageHorsePage, beforeEnter: [isAdmin] },
  {
    path: "/permissions",
    component: ManagePermissions,
    beforeEnter: [isAdmin],
  },
  { path: "/rManage", component: ManageRiderPage, beforeEnter: [isAdmin] },
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
});

export default router;
