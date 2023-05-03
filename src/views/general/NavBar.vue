<template>
    <nav :key="role" class="navbar navbar-expand-sm navbar-light bg-light" style="height:7vh">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto d-flex justify-content-between" style="width:100%">
                <div class="d-flex ps-3">
                    <li class="nav-item">
                        <router-link class="nav-link" to="/">Home</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/map">Map</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/announcements">Announcements</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" v-if="isAdmin" to="/manage">Manage Events</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" v-if="isAdmin" to="/hManage">Manage Horse Information</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" v-if="isAdmin" to="rManage">Manage Rider Information</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" v-if="isAdmin" to="/permissions">Manage Permissions</router-link>
                    </li>
                </div>
                <div class="pe-3">
                    <li class="nav-item dropdown dropleft">
                        <a class="nav-link dropdown-toggle dropleft" href="#" id="navbarDropdown" role="button"
                            data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Menu
                        </a>
                        <div class="dropdown-menu dropdown-menu-start" aria-labelledby="navbarDropdown"
                            style="right: 0; left: auto;">
                    <li class="nav-item active">
                        <router-link v-if="!getAuth" class="nav-link dropdown-item" to="/Login">Login</router-link>
                    </li>
                    <li class="nav-item active">
                        <router-link v-if="!getAuth" class="nav-link dropdown-item" to="/Signup">Signup</router-link>
                    </li>
                    <li>
                        <button v-if="getAuth" class="nav-link dropdown-item" @click="logout">Logout</button>
                    </li>
                </div>
                </li>
        </div>
        </ul>
        </div>
    </nav>
</template>
  
<script>

import { useStore, mapGetters } from 'vuex'
import {computed} from 'vue'

export default {
    name: 'NavBar',
    components: {
    },
    setup() {
        const store = useStore()
        return {
            role: computed(() => store.getters.getRole)
        }
    },
    computed: {
        ...mapGetters(['getRole', 'getAuth']),
        isAdmin() {
            return this.role == 4
        }
    },
    methods: {
        logout() {
          delete this.$axios.defaults.headers.common["Authorization"];
          this.$store.commit('setRole', 0)
          this.$store.commit('setAuth', false)
          this.$notify({
            title: 'Success',
            text: `Succesfully logged out`,
            type: 'success'
          });
          this.$router.push({path: '/'})
        }
    }
    ,data(){
        return{
            admin: true,
            coach: true,
            user: false
        }
    }
}
</script>
  
<style scoped></style>