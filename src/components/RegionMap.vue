<template>
  <div class="mapContainer">
      <MapContainer/>
  </div>
</template>

<script>
import MapContainer from './MapContainer.vue'

export default {
  name: 'RegionMap',
  components: {
    MapContainer
  }
}
</script>

<style scoped>

.mapContainer {
  height:100%;
  width:100%;
  background-color:lightgray;
}
</style>