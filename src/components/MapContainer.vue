<template>
    <div style="background-color: white; padding:10px">
        
        <input type="checkbox" v-model="drawFeatures" @change="drawOn" /> Add Elements
    
        <select id="type" v-model="drawType">
            <option value="Point">Add School</option>
            <option value="Polygon">Add Region</option>
        </select>
        <input type="checkbox" v-model="selectFeatures" @change="selectOn" /> Edit Elements
        <input type="checkbox" v-model="deleteFeatures" @change="deleteOn" /> Delete Elements
    </div>


    <ol-map @click="handleClick" :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true" style="height:400px" >

        <ol-view ref="view" :center="center" :rotation="rotation" :zoom="zoom" :projection="projection" />

        <ol-tile-layer>
            <ol-source-osm />
        </ol-tile-layer>

        <ol-interaction-select @select="featureSelected" :condition="selectCondition" :filter="selectInteactionFilter" >
            <ol-style>
                <ol-style-stroke color="green" :width="10"></ol-style-stroke>
                <ol-style-fill color="rgba(255,255,255,0.5)"></ol-style-fill>
                <ol-style-icon v-if="selectFeatures" :src="markerIcon" :scale="0.08">hola hola</ol-style-icon>
            </ol-style>
        </ol-interaction-select>

        <ol-vector-layer ref="vectorLayer">
            <ol-source-vector :projection="projection" >

                <ol-interaction-draw v-if="drawFeatures" :type="drawType" >

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

        const format = inject('ol-format');

        const geoJson = new format.GeoJSON();


        const selectConditions = inject('ol-selectconditions')

        const selectCondition = selectConditions.click;
        console.log("Select: ", selectConditions)

        
        const drawType = ref("Point")

        let drawFeatures = ref(false);
        let selectFeatures = ref(false);
        let deleteFeatures = ref(false);


        return {
            center,
            projection,
            zoom,
            rotation,
            selectCondition,
            geoJson,
            markerIcon,
            drawFeatures,
            selectFeatures,
            deleteFeatures,
            drawType,
        }
    },
    methods: {
        featureSelected(event) {
            if (event && event.selected && event.selected.length) {
                console.log(event.selected[0].ol_uid)
                // remove feature
                // this.$refs.vectorLayer.vectorLayer.getSource().removeFeature(event.selected[0])
            }
        },

        selectInteactionFilter() {
            return this.selectFeatures
        },

        selectOn() {
            this.selectFeatures = true
            this.drawFeatures = false
            this.deleteFeatures = false
        },

        drawOn() {
            this.drawFeatures = true
            this.selectFeatures = false
            this.deleteFeatures = false
        },

        deleteOn() {
            this.deleteFeatures = true
            this.selectFeatures = false
            this.drawFeatures = false
        },

        pointerMoveHandler(evt) {
            console.log(evt)
        },

        handleClick(evt) {
            if (this.selectFeatures) {
                console.log(evt)
            }
        }
    }
}
</script>