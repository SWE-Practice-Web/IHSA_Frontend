import * as VueRouter from "vue-router";
import HomePage from "./views/general/HomePage.vue"
import MapContainer from "./views/general/MapPage.vue"
import LoginPage from "./views/auth/LoginPage.vue"
import SignupPage from "./views/auth/SignupPage.vue"
import AnnouncementPage from "./views/general/AnnouncementPage.vue"
import ManageHorsePage from "./views/admin/ManageHorsePage.vue"
import ManageEventPage from "./views/admin/ManageEventPage.vue"
import manageEventClasses from "./components/manageEventClasses.vue"
import ManagePermissions from "./views/admin/ManagePermissionsPage.vue"
import ManageRiderPage from "./views/admin/ManageRiderPage.vue"
import store from './store'

const routes = [
  { path: "/", component: HomePage },
  { path: "/map", component: MapContainer },
  { path: "/login", component: LoginPage },
  { path: "/signup", component: SignupPage },
  { path: "/announcements", component: AnnouncementPage },
  { path: "/manage", component: ManageEventPage, meta: { requiresAuth: true }},
  { path: "/manageEventClasses", component: manageEventClasses, meta: { requiresAuth: true }},
  { path: "/hManage", component: ManageHorsePage, meta: { requiresAuth: true } },
  {
    path: "/permissions",
    component: ManagePermissions,
    meta: { requiresAuth: true },
  },
  { path: "/rManage", component: ManageRiderPage, meta: { requiresAuth: true } },
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
});

router.beforeEach((to) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (store.getters.getRole != 4) {
      return false
    } 
  } 
  return true
});


export default router;
