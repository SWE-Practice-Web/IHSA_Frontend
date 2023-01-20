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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
  width: 100vw;
  /* margin-top: 60px; */
}
</style>
