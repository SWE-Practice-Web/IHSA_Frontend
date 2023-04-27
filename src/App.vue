<template>
  <div>
    <notifications class="m-2"/>
    <NavBar :key="getRole" class="fixed-top"/>
    <router-view></router-view>
  </div>
</template>

<script>
import NavBar from './views/general/NavBar.vue'
import { mapGetters } from 'vuex';

export default {
  name: 'App',
  components: {
    NavBar
  },
  computed: {
    ...mapGetters(["getRole"])
  }
}
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Montserrat&display=swap");

* {
  box-sizing: border-box;
  font-size: 0.8rem !important;
  font-family: "Montserrat" sans-serif;
}
html, body {
  /* height: 100%; */
  margin: 0;
  background-color: rgb(234, 242, 255);
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 93vh;
  width: 100%;
  margin-top: 7vh;
}
</style>
