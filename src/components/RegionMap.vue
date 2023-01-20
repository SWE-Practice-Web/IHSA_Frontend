<template>
  <div class="container">
    <GMapMap
        :center=center
        :zoom="7"
        map-type-id="terrain"
        style="width: 90vw; height: 90vh"
    >
    </GMapMap>
  </div>
</template>

<script >
export default {
  name: 'App',
  data() {
    return {
      center: {lat: 40.35, lng: -94.88},
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container{
  height:100vh;
  width:100vw;
}
h3 {
  margin: 40px 0 0;
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
  color: #42b983;
}
</style>
