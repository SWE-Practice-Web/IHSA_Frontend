<template>
  <div class="hero-image">
    <div class="card" style=" background-color: lightgray; border-style: solid; border-color: black; border-width: 2px;">
      <div class="card-body">
        <div class="card">
          <div class="hello">
            <img alt="IHSA logo" src="../../assets/ihsalogo.png" height="150" width="200">
            <div>
              <br>
              <form @submit.prevent="login" class="login">
                <h5>
                  Username
                </h5>
                <input type="username" v-model="username" placeholder="Username" autocomplete="on">
                <h5>
                  Password
                </h5>
                <input type="password" v-model="password" placeholder="Password" autocomplete="on">
                <br>
                <button class="btn btn-dark" type="submit">Login</button>
                <br>
                <br>
                <p>Don't have an account? <router-link class="nav-link" to="/Signup">Sign up here</router-link> </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { useStore } from 'vuex'
import {computed} from 'vue'
export default {
  name: 'LoginPage',
  setup() {
    const store = useStore()
    return {
      username: null,
      password: null,
      role: computed(() => store.getters.getRole)
    }
  },
  methods: {
    login() {
      this.$axios.post('/User/Login', {username: this.username, password: this.password})
        .then(async (response) => {
          this.$axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
          this.$store.commit('setRole', response.data.user.role)
          this.$store.commit('setAuth', true)
          this.$notify({
            title: 'Success',
            text: `Succesfully logged in`,
            type: 'success'
          });
          this.$router.push({path: '/'})
        }).catch(() => {
          this.$notify({
            title: 'Error',
            text: `Error attempting to log in`,
            type: 'error'
          });
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h5 {
  margin-bottom: 0rem;
}

input {
  margin-bottom: 1rem;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #4000ff;
}

.card-body {
  padding: 20px 30px;
}

.hello {
  padding: 5px 10px;
}

.hero-image {
  height: 93vh;
  width: 100%;
  background-image: url("../../assets/ihsabackground.jpg");
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
