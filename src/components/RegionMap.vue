;<template>
  <div class="container">
    <div class="cell cell-map">
      <MapContainer />
    </div>
    <div class="cell cell-edit">
      Edit
    </div>
    <div class="cell cell-inspect">
      Inspect
    </div>
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

<style>
.container {
  display:grid;
  height:100%;
  width:100%;
}
.cell {
  margin:3px;
  border: 1px red solid;
  border-radius: 4px;
  background-color: lightgrey;
}

.cell-map {
  grid-column: 1;
  grid-row-start: 1;
  grid-row-end: 3;
}

.cell-edit {
  grid-column: 2;
  grid-row: 1;
}

.cell-inspect {
  grid-column: 2;
  grid-row: 2;
}
</style>