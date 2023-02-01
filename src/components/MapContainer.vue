<template>

    <input type="checkbox" v-model="draw" @change="drawOn"/> Draw
    <br>
    <input type="checkbox" v-model="select" @change="selectOn"/> Select

    <select id="type" v-model="drawType">
        <option value="Point">Point</option>
        <option value="Polygon">Polygon</option>
    </select>

    <ol-map :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true" style="height:400px">

        <ol-view ref="view" :center="center" :rotation="rotation" :zoom="zoom" :projection="projection" />

        <ol-tile-layer>
            <ol-source-osm />
        </ol-tile-layer>

        <ol-interaction-select @select="featureSelected" :condition="selectCondition" :filter="selectInteactionFilter">
            <ol-style>
                <ol-style-stroke color="green" :width="10"></ol-style-stroke>
                <ol-style-fill color="rgba(255,255,255,0.5)"></ol-style-fill>
                <ol-style-icon v-if="select" :src="markerIcon" :scale="0.08"></ol-style-icon>
            </ol-style>
        </ol-interaction-select>

        <ol-vector-layer>
            <ol-source-vector :projection="projection">

                <ol-interaction-draw v-if="draw" :type="drawType" @drawend="drawend" @drawstart="drawstart">

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

        const selectCondition = selectConditions.pointerMove;

        const featureSelected = (event) => {

            console.log(event)

        }

        const selectInteactionFilter = () => {
            return select.value
        };

        const drawType = ref("Point")

        const drawstart = (event) => {
            console.log(event)

        }

        const drawend = (event) => {
            console.log(event)
        }
        
        let draw = ref(false);
        let select = ref(false);

        const selectOn = () => {
            select.value = true
            draw.value = false
        }

        const drawOn = () => {
            select.value = false
            draw.value = true
        }

        return {
            center,
            projection,
            zoom,
            rotation,
            selectCondition,
            featureSelected,
            selectInteactionFilter,
            geoJson,
            markerIcon,
            draw,
            select,
            drawType,
            drawstart,
            drawend,
            selectOn,
            drawOn
        }
    },
}
</script>