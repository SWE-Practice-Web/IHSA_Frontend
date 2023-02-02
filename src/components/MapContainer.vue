<template>
    <div class="container">
        <div style="background-color: white" class="child1">
            <input type="checkbox" v-model="drawFeaturesOn" @change="drawOn" /> Add Elements

            <select id="type" v-model="drawType">
                <option value="Point">Add School</option>
                <option value="Polygon">Add Region</option>
            </select>
            <input type="checkbox" v-model="selectFeaturesOn" @change="selectOn" /> Edit Elements
            <input type="checkbox" v-model="deleteFeaturesOn" @change="deleteOn" /> Delete Elements
        </div>


        <ol-map :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true" class="child2">

            <ol-view ref="view" :center="center" :rotation="rotation" :zoom="zoom" :projection="projection" />

            <ol-tile-layer>
                <ol-source-osm />
            </ol-tile-layer>

            <ol-interaction-select @select="handleClick" :condition="selectCondition"
                :filter="selectInteactionFilter">
                <ol-style>
                    <ol-style-stroke color="green" :width="10"></ol-style-stroke>
                    <ol-style-fill color="rgba(255,255,255,0.5)"></ol-style-fill>
                    <ol-style-icon v-if="selectFeaturesOn || deleteFeaturesOn" :src="markerIcon" :scale="0.08"></ol-style-icon>
                </ol-style>
            </ol-interaction-select>

            <ol-vector-layer ref="vectorLayer">
                <ol-source-vector :projection="projection">

                    <ol-interaction-draw v-if="drawFeaturesOn" :type="drawType" @drawend="addFeature">

                    </ol-interaction-draw>

                </ol-source-vector>

                <ol-style>
                    <ol-style-stroke color="red" :width="2"></ol-style-stroke>
                    <ol-style-fill color="rgba(255,255,255,0.1)"></ol-style-fill>
                    <ol-style-circle :radius="7">
                        <ol-style-fill color="blue"></ol-style-fill>
                    </ol-style-circle>
                </ol-style>
            </ol-vector-layer>
        </ol-map>
        <div style="background-color: lightgray;" class="child3">{{ selectedFeature }}</div>
    </div>
</template>

<script>
import markerIcon from '../assets/marker.png'
import {
    ref,
    inject
} from 'vue'
export default {
    setup() {
        const center = ref([40, 40])
        const projection = ref('EPSG:4326')
        const zoom = ref(8)
        const rotation = ref(0)
        const features = ref({schools:{}, regions:{}})
        let selectedFeature = ref({})

        const format = inject('ol-format');

        const geoJson = new format.GeoJSON();


        const selectConditions = inject('ol-selectconditions')

        const selectCondition = selectConditions.click;

        
        const drawType = ref("Point")

        let drawFeaturesOn = ref(false);
        let selectFeaturesOn = ref(false);
        let deleteFeaturesOn = ref(false);


        return {
            center,
            projection,
            zoom,
            rotation,
            selectCondition,
            geoJson,
            markerIcon,
            drawFeaturesOn,
            selectFeaturesOn,
            deleteFeaturesOn,
            drawType,
            features,
            selectedFeature,
        }
    },
    methods: {
        handleClick(event) {
            let feature;
            if (event && event.selected && event.selected.length) { 
                feature = event.selected[0]
                if (this.selectFeaturesOn) {this.selectFeature(feature)}
                else if (this.deleteFeaturesOn) {this.deleteFeature(feature)}
            }
        },

        selectFeature(feature) {
            if (this.getTypeFromFeature(feature) == "Point2") {
                this.selectedFeature = this.features.schools[feature.ol_uid]
            } else {
                this.selectedFeature = this.features.regions[feature.ol_uid]
            }
        },

        deleteFeature(feature) {
            this.$refs.vectorLayer.vectorLayer.getSource().removeFeature(feature)
        },

        selectInteactionFilter() {
            return this.selectFeaturesOn || this.deleteFeaturesOn
        },

        selectOn() {
            this.selectFeaturesOn = true
            this.drawFeaturesOn = false
            this.deleteFeaturesOn = false
        },

        drawOn() {
            this.drawFeaturesOn = true
            this.selectFeaturesOn = false
            this.deleteFeaturesOn = false
        },

        deleteOn() {
            this.deleteFeaturesOn = true
            this.selectFeaturesOn = false
            this.drawFeaturesOn = false
        },

        addFeature(evt) {
            let newFeature;
            if (this.drawType == "Point") {
                newFeature = {
                    "School Name": "",
                    "Number of Riders": "",
                    "Is Anchor School": "",
                    "Feature Id": evt.feature.ol_uid
                }
                this.features.schools[evt.feature.ol_uid] = newFeature
            } else {
                newFeature = {
                    "Region Number/Name": "",
                    "Number of Riders": "",
                    "Feature Id": evt.feature.ol_uid
                }
                this.features.regions[evt.feature.ol_uid] = newFeature
            }
            this.selectedFeature = newFeature;
        },

        getTypeFromFeature(feature) {
            return feature.getGeometry().constructor.name
        }
    }
}
</script>
<style scoped>
.container {
  display: grid;
  grid-template-columns: 70% 30%;
  grid-template-rows: 5% 95%;
  height: 100vh;
  width: 100vw;
}

.child1 {
  grid-column: 1 / 3;
  grid-row: 1;
}

.child2 {
  grid-column: 1;
  grid-row: 2;
}

.child3 {
  grid-column: 2;
  grid-row: 2;
}
</style>