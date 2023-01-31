<template>
  <RegionMap class="regionMap"/>
</template>

<script>
import RegionMap from './components/RegionMap.vue'

export default {
  name: 'App',
  components: {
    RegionMap
  }
}
</script>

<style>
html, body {
  height: 100%;
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
  width: 100vw;
}
</style>
