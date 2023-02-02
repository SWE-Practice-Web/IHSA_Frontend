<template>
    <div class="container">
        <div style="background-color: white" class="child1" v-show="hasEditAcces()">
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
        const format = inject('ol-format');
        const geom = inject('ol-geom');
        const Feature = inject('ol-feature');
        const geoJson = new format.GeoJSON();
        const selectConditions = inject('ol-selectconditions')
        const selectCondition = selectConditions.click;
        const drawType = ref("Point")
        let role = ref("admin")
        let selectedFeature = ref({})
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
            geom,
            Feature,
            role
        }
    },

    mounted () {
        // const coordinates = [
        //     [
        //         [
        //             40.845947265625,
        //             40.69303993601352
        //         ],
        //         [
        //             40.82305897027254,
        //             39.67222714331001
        //         ],
        //         [
        //             41.66076648980379,
        //             39.695115271024406
        //         ],
        //         [
        //             40.845947265625,
        //             40.69303993601352
        //         ]
        //     ]
        // ]
    },

    methods: {

        /**
        * Function to handle clicks when 'Edit Elements' or 'Delete Elements' checkbox are selected.
        *
        * @param {event} evt. Event emitted by the dom
        */
        handleClick(evt) {
            let feature;
            if (evt && evt.selected && evt.selected.length) {
                feature = evt.selected[0]
                if (this.selectFeaturesOn) { this.selectFeature(feature) }
                else if (this.deleteFeaturesOn) { this.deleteFeature(feature) }
            }
        },



        /**
        * Function to handle clicks when 'Edit Elements' checkbox is selected.
        *
        * @param {Feature} feature. Feature being clicked on
        */
        selectFeature(feature) {
            if (this.getTypeFromFeature(feature) == "Point2") {
                this.selectedFeature = this.features.schools[feature.ol_uid]
            } else {
                this.selectedFeature = this.features.regions[feature.ol_uid]
            }
        },



        /**
        * Function to handle clicks when 'Delete Elements' checkbox is selected.
        *
        * @param {Feature} feature. Feature being clicked on
        */
        deleteFeature(feature) {
            this.$refs.vectorLayer.vectorLayer.getSource().removeFeature(feature)
        },



        /**
        * Function to filter select interactions. If returns true, handleClick function will be called, otherwise not.
        *
        * @return {Boolean} True if select should activate, false otherwise
        */
        selectInteactionFilter() {
            return this.selectFeaturesOn || this.deleteFeaturesOn
        },



        /**
        * Function called when the 'Edit Elements' checkbox is clicked. Sets selectFeaturesOn to true and all others to false
        */
        selectOn() {
            this.selectFeaturesOn = true
            this.drawFeaturesOn = false
            this.deleteFeaturesOn = false
        },



        /**
        * Function called when the 'Add Elements' checkbox is clicked. Sets drawFeaturesOn to true and all others to false
        */
        drawOn() {
            this.drawFeaturesOn = true
            this.selectFeaturesOn = false
            this.deleteFeaturesOn = false
        },



        /**
        * Function called when the 'Delete Elements' checkbox is clicked. Sets deleteFeaturesOn to true and all others to false
        */
        deleteOn() {
            this.deleteFeaturesOn = true
            this.selectFeaturesOn = false
            this.drawFeaturesOn = false
        },



        /**
        * Function to add features to the map. Gets called when drawFeaturesOn is set to true and the user finished drawing.
        * It creates and adds a feature to 'this.features.schools' if the drawType is Point, or to 'this.features.regions' otherwise.
        * It also sets this.selectedFeature as this new feature. 
        *
        * @param {event} evt. Event emitted by the dom when the user finishes a drawing
        */
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



        /**
        * Function to get the name of the geometry type of a feature
        *
        * @param {Feature} feature. Feature to get the geometry type name from.
        */
        getTypeFromFeature(feature) {
            return feature.getGeometry().constructor.name
        },



        /**
        * Function to add features to the map. The difference between addFeature and this function is only used to add saved features from the backend.
        * Basically, if there are some regions and schools already saved from previous sessions. This will load that.
        * It creates and adds a feature to 'this.features.schools' if the type is Point, or to 'this.features.regions' otherwise.
        *
        * @param {event} evt. Event emitted by the dom when the user finishes a drawing
        */
        loadFeature(type, coordinates) {
            let newGeometry;
            if (type == "Point") {
                newGeometry = new this.geom.Point(coordinates)
            } else {
                newGeometry = new this.geom.Polygon(coordinates)
            }
            const newFeature = new this.Feature({geometry: newGeometry})
            this.$refs.vectorLayer.vectorLayer.getSource().addFeature(newFeature)
        },

        /**
        * Function to check if the current user has edit access. As of right now, only admin has edit access.
        * @return {Boolean} Returns a boolean indicating if the user has edit access or not.
        */
        hasEditAcces() {
            return this.role == "admin"
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