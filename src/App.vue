<template>
  <div>
    <notifications class="m-2"/>
    <NavBar class="fixed-top"/>
    <router-view></router-view>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'

export default {
  name: 'App',
  components: {
    NavBar
  }
}
</script>

<style>
* {
  box-sizing: border-box;
  font-size: 0.8rem !important;
}
html, body {
  /* height: 100%; */
  margin: 0;
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
