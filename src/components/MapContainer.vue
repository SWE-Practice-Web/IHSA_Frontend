<template>
    <div class="container">
        <div style="background-color: white" class="child1" v-show="hasEditAcces()">
            <select v-model="selectedSchool" aria-placeholder="Select a school">
                <option disabled value="Please select a school" selected>Please select a school</option>
                <option v-for="school in ihsa_schools" :value="school" :key="school.name">
                    {{ school.name }}
                </option>
            </select>
            <button @click="addSchool">Add School</button>

            <input type="checkbox" v-model="drawOn" @change="toggleDrawOn" style="margin-left;:15px"/> Draw Region
            <input type="checkbox" v-model="selectOn" @change="toggleSelectOn" /> Edit Elements
            <input type="checkbox" v-model="deleteOn" @change="toggleDeleteOn" /> Delete Elements
        </div>


        <ol-map :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true" class="child2">

            <ol-view ref="view" :center="center" :rotation="rotation" :zoom="zoom" :projection="projection" />

            <ol-tile-layer>
                <ol-source-osm />
            </ol-tile-layer>

            <ol-interaction-select @select="handleClick" :condition="selectCondition"
                :filter="selectInteractionFilter" ref="select">
                <ol-style>
                    <ol-style-stroke color="green" :width="10"></ol-style-stroke>
                    <ol-style-fill color="rgba(255,255,255,0.5)"></ol-style-fill>
                    <ol-style-icon v-if="selectOn || deleteOn" :src="markerIcon" :scale="0.09"></ol-style-icon>
                </ol-style>
            </ol-interaction-select>

            <ol-vector-layer ref="vectorLayer">
                <ol-source-vector :projection="projection">

                    <ol-interaction-draw v-if="drawOn" type="Polygon" @drawend="addFeature">

                    </ol-interaction-draw>

                </ol-source-vector>

                <ol-style>
                    <ol-style-stroke color="red" :width="2"></ol-style-stroke>
                    <ol-style-fill color="rgba(255,255,255,0.1)"></ol-style-fill>
                    <ol-style-circle :radius="18">
                        <ol-style-fill color="blue"></ol-style-fill>
                    </ol-style-circle>
                    <ol-style-icon :src="markerIcon" :scale="0.07"></ol-style-icon>
                </ol-style>
            </ol-vector-layer>
        </ol-map>
        <div style="background-color: lightgray;" class="child3">
            <div v-for="value, name in selectedFeature" :key="name">
                {{ name }} <input type="text" v-model="selectedFeature[name]">
            </div>
        </div>
    </div>
</template>

<script>
import markerIcon from '../assets/marker.png'
import schoolsCoordinates from '../../public/ihsa_schools.json'
import {
    ref,
    inject
} from 'vue'
export default {
    setup() {
        const center = ref([-87.86, 42.45])
        const projection = ref('EPSG:4326')
        const zoom = ref(8)
        const rotation = ref(0)
        const features = ref({schools:{}, regions:{}})
        const geom = inject('ol-geom');
        const Feature = inject('ol-feature');
        const selectConditions = inject('ol-selectconditions')
        const selectCondition = selectConditions.click;
        let lastSelectedFeature = null;
        let selectedSchool = ref("Please select a school")
        let role = ref("admin")
        let selectedFeature = ref({})
        let drawOn = ref(false);
        let selectOn = ref(true);
        let deleteOn = ref(false);
        let ihsa_schools = schoolsCoordinates.Placemark


        return {
            center,
            projection,
            zoom,
            rotation,
            selectCondition,
            markerIcon,
            drawOn,
            selectOn,
            deleteOn,
            features,
            lastSelectedFeature,
            selectedFeature,
            geom,
            Feature,
            role,
            ihsa_schools,
            selectedSchool
        }
    },

    mounted () {
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
                this.lastSelectedFeature = feature
                if (this.selectOn) { this.selectFeature(feature) }
                else if (this.deleteOn) { this.deleteFeature(feature) }
            } 
        },



        /**
        * Function to handle clicks when 'Edit Elements' checkbox is selected.
        *
        * @param {Feature} feature. Feature being clicked on
        */
        selectFeature(feature) {
            if (this.getTypeFromFeature(feature) == "Point") {
                this.selectedFeature = this.features.schools[feature.id_]
            } else {
                this.selectedFeature = this.features.regions[feature.id_]
                this.getPointsInsidePolygon(feature)
            }
        },



        /**
        * Function to handle clicks when 'Delete Elements' checkbox is selected.
        * Removes the feature from the map as well as from this.features
        *
        * @param {Feature} feature. Feature being clicked on
        */
        deleteFeature(feature) {
            console.log(this.features.schools[feature.id_])
            this.$refs.vectorLayer.vectorLayer.getSource().removeFeature(feature)
            if (this.getTypeFromFeature(feature) == "Point") {
                delete this.features.schools[feature.id_]
            } else {
                delete this.features.regions[feature.id_]
            }
        },



        /**
        * Function to filter select interactions. If returns true, handleClick function will be called, otherwise not.
        *
        * @return {Boolean} True if select should activate, false otherwise
        */
        selectInteractionFilter() {
            return this.selectOn || this.deleteOn
        },



        /**
        * Function called when the 'Edit Elements' checkbox is clicked. Sets selectOn to true and all others to false
        */
        toggleSelectOn() {
            this.selectOn = true
            this.drawOn = false
            this.deleteOn = false
        },



        /**
        * Function called when the 'Add Elements' checkbox is clicked. Sets drawOn to true and all others to false
        */
        toggleDrawOn() {
            this.drawOn = true
            this.selectOn = false
            this.deleteOn = false
        },



        /**
        * Function called when the 'Delete Elements' checkbox is clicked. Sets deleteOn to true and all others to false
        */
        toggleDeleteOn() {
            this.cleanSelectedFeatures() //Unselect any selected features beacuse otherwise select doesn't work properly
            this.deleteOn = true
            this.selectOn = false
            this.drawOn = false
        },



        /**
        * Function to add features to the map. Gets called when drawOn is set to true and the user finished drawing.
        * It creates and adds a feature to 'this.features.schools' if the drawType is Point, or to 'this.features.regions' otherwise.
        * It also sets this.selectedFeature as this new feature. 
        *
        * @param {event} evt. Event emitted by the dom when the user finishes a drawing
        */
        addFeature(evt) {
            let newFeature;
            evt.feature.setId(evt.feature.ol_uid)
            if (this.drawType == "Point") {
                newFeature = {
                    "schoolName": "",
                    "numOfRiders": "",
                    "isAnchorSchool": "",
                    "featureId": evt.feature.id_,
                    "geometryType": "Point"
                }
                this.features.schools[evt.feature.id_] = newFeature
            } else {
                newFeature = {
                    "regionId": "",
                    "featureId": evt.feature.id_,
                    "geometryType": "Polygon"
                }
                this.features.regions[evt.feature.id_] = newFeature
            }
            this.selectedFeature = newFeature;
        },



        /**
        * Function to get the name of the geometry type of a feature
        *
        * @param {Feature} feature. Feature to get the geometry type name from.
        */
        getTypeFromFeature(feature) {
            return feature.getGeometry().getType()
        },



        /**
        * Function to add features to the map. The difference between addFeature and this function is only used to add saved features from the backend.
        * Basically, if there are some regions and schools already saved from previous sessions. This will load that.
        * It creates and adds a feature to 'this.features.schools' if the type is Point, or to 'this.features.regions' otherwise.
        *
        * @param {Object} feature. Feature generated by this page. The properties of this feature depend on if the feature is a school or region:
        * school: {geometryType, featureId, coordinates, schoolName, numOfRiders, isAnchorSchool}
        * school: {geometryType, featureId, coordinates, regionId}
        * @return {Object} Returns the newly created feature object
        */
        loadFeature(feature) {
            //Load feature properties
            let {geometryType, featureId, coordinates, schoolName, numOfRiders, isAnchorSchool, regionId} = feature;
            //Add feature to map
            let newGeometry;
            if (geometryType == "Point") {
                newGeometry = new this.geom.Point(coordinates)
            } else {
                newGeometry = new this.geom.Polygon(coordinates)
            }
            const newMapFeature = new this.Feature({geometry: newGeometry})
            featureId = featureId ? featureId !== null : newMapFeature.ol_uid
            newMapFeature.setId(featureId)
            this.$refs.vectorLayer.vectorLayer.getSource().addFeature(newMapFeature)

            let newFeature;
            //Add feature to this.features
            if (geometryType == "Point") {
                newFeature = {
                    "schoolName": schoolName,
                    "numOfRiders": numOfRiders,
                    "isAnchorSchool": isAnchorSchool,
                    "featureId": featureId,
                    "geometryType": geometryType
                }
                this.features.schools[featureId] = newFeature
            } else {
                newFeature = {
                    "regionId": regionId,
                    "featureId": featureId,
                    "geometryType": geometryType
                }
                this.features.regions[featureId] = newFeature
            }
            return newFeature
        },

        /**
        * Function to check if the current user has edit access. As of right now, only admin has edit access.
        * @return {Boolean} Returns a boolean indicating if the user has edit access or not.
        */
        hasEditAcces() {
            return this.role == "admin"
        },


        /**
        * Function to unselect all selected features.
        */
        cleanSelectedFeatures() {
            this.$refs.select.select.getFeatures().clear() 
        },


        /**
        * Function to add a school from the list of IHSA schools to the map. When Add School button is clicked, whichever school is selected
        * in the select school list, will be added to the map.
        */
        addSchool() {
            if (this.selectedSchool == "Please select a school") {return}
            const lat = this.selectedSchool.LookAt.latitude
            const lon = this.selectedSchool.LookAt.longitude
            const coordinates = [lon, lat]
            
            const newSchool = {
                "geometryType":"Point", 
                "featureId":null, 
                "schoolName": this.selectedSchool.Snippet, 
                "coordinates":coordinates, 
                "numOfRiders":0,
                "isAnchorSchool":false,
            
            }
            const school = this.loadFeature(newSchool)
            this.selectedFeature = school
            this.center = coordinates
        },


        getPointsInsidePolygon(myPolygon) {
            var candidates = [];
            const getGeometryType = this.getTypeFromFeature //For some reason this turns undefined inside forEachFeatureIntersectingExtent. So, I am saving this function here
            const source = this.$refs.vectorLayer.vectorLayer.getSource()
            source.forEachFeatureIntersectingExtent(myPolygon.getGeometry().getExtent(), function (feature) {
                if (getGeometryType(feature) == 'Point' && myPolygon.getGeometry().intersectsCoordinate(feature.getGeometry().getCoordinates())) {
                    candidates.push(feature);
                }
            });
            console.log(candidates)

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