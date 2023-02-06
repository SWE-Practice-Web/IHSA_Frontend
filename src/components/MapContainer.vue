<template>
    <div class="container">
        <div style="background-color: white" class="child1" v-show="hasEditAcces()">
            <!-- <select v-model="selectedSchool" aria-placeholder="Select a school">
                <option disabled value="Please select a school" selected>Please select a school</option>
                <option v-for="school in ihsa_schools" :value="school" :key="school.name">
                    {{ school.name }}
                </option>
            </select>
            <button @click="addSchool">Add School</button> -->

            <input type="checkbox" v-model="drawOn" @change="toggleDrawOn" style="margin-left;:15px"/> Draw Region
            <input type="checkbox" v-model="selectOn" @change="toggleSelectOn" /> Select
            <input type="checkbox" v-model="deleteOn" @change="toggleDeleteOn" /> Delete
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
                    <ol-style-icon v-if="selectOn || deleteOn" :src="handleMarker()" :scale="0.4"></ol-style-icon>
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
                    <ol-style-icon :src="blackMarker" :scale="0.2"></ol-style-icon>
                </ol-style>
            </ol-vector-layer>
        </ol-map>
        <div style="background-color: lightgray;" class="child3">
            <div v-if="selectedFeature.schoolName !== undefined">School Name <input type="text" v-model="selectedFeature.schoolName"></div><br>
            <div  v-if="selectedFeature.numOfRiders !== undefined">Number of Riders <input type="text" v-model="selectedFeature.numOfRiders"></div><br>
            <div  v-if="selectedFeature.isAnchorSchool !== undefined">Is Anchor School <input type="checkbox" v-model="selectedFeature.isAnchorSchool"></div><br>
            <div  v-if="selectedFeature.region !== undefined">
                Region
                <select v-model="selectedFeature.region" @change="changeRegion">
                    <option v-for="region in regions" :value="region" :key="region">{{ region }}</option>
                </select>
            </div>
        </div>
    </div>
</template>

<script>
import blackMarker from '../assets/blackMarker.png' //Location icon by Icons8
import redMarker from '../assets/redMarker.png' //Location icon by Icons8
import yellowMarker from '../assets/yellowMarker.png' //Location icon by Icons8
import greenMarker from '../assets/greenMarker.png' //Location icon by Icons8
import bluedMarker from '../assets/blueMarker.png' //Location icon by Icons8
import lightBlueMarker from '../assets/lightBlueMarker.png' //Location icon by Icons8
import * as Style from 'ol/style/'

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
        const selectCondition = selectConditions.pointerMove;
        // const selectCondition = selectConditions.click;
        const regions = ref([1,2,3,4,5])
        let lastSelectedFeature = ref(null);
        let selectedRegion = ref({});
        let selectedSchool = ref("Please select a school")
        let role = ref("admin")
        let selectedFeature = ref({})
        let drawOn = ref(false);
        let selectOn = ref(true);
        let deleteOn = ref(false);
        let ihsa_schools = schoolsCoordinates.Placemark
        let createdSchools = ref(new Set())
        let regionToMarker = ref({
            1: redMarker,
            2: yellowMarker,
            3: greenMarker,
            4: bluedMarker,
            5: lightBlueMarker
        })


        return {
            center,
            projection,
            zoom,
            rotation,
            selectCondition,
            blackMarker,
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
            selectedSchool,
            selectedRegion,
            createdSchools,
            regionToMarker,
            Style,
            regions
        }
    },

    mounted () {
        for (let school of this.ihsa_schools) {
            this.addSchool(school)
        }
    },

    methods: {

        changeRegion(evt) {
            const newRegion = evt.target.value
            const newStyle = new Style.Style({
                    image: new Style.Icon({
                        src: this.regionToMarker[newRegion],
                        scale: 0.3
                    })
                })
            this.lastSelectedFeature.setStyle(newStyle)
        },

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

        handleMarker() {
            if (this.lastSelectedFeature == null) {
                return this.blackMarker
            } else {
                let feature = this.lastSelectedFeature
                const selectedSchool = this.features.schools[feature.id_]
                return this.regionToMarker[selectedSchool.region]
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
                this.selectedRegion = this.getSchoolsInsidePolygon(feature)
            }
        },



        /**
        * Function to handle clicks when 'Delete Elements' checkbox is selected.
        * Removes the feature from the map as well as from this.features
        *
        * @param {Feature} feature. Feature being clicked on
        */
        deleteFeature(feature) {
            this.$refs.vectorLayer.vectorLayer.getSource().removeFeature(feature)
            if (this.getTypeFromFeature(feature) == "Point") {
                this.createdSchools.delete(this.features.schools[feature.id_]['schoolName'])
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
            newFeature = {
                "regionId": "",
                "featureId": evt.feature.id_,
                "geometryType": "Polygon"
            }
            this.features.regions[evt.feature.id_] = newFeature
            this.selectedRegion = this.getSchoolsInsidePolygon(evt.feature)
            this.selectedFeature = newFeature;
        },



        /**
        * Function to get the name of the geometry type of a feature
        *
        * @param {Feature} feature. Feature to get the geometry type name from.
        * @return {String} String representing the geometry type of the inputted feature.
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
            let {geometryType, featureId, coordinates, schoolName, numOfRiders, isAnchorSchool, regionId, region} = feature;
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
            if (geometryType == "Point") {
                const iconStyle = new Style.Style({
                    image: new Style.Icon({
                        src: this.regionToMarker[region],
                        scale: 0.3
                    })
                })
                newMapFeature.setStyle(iconStyle)
            }
            this.$refs.vectorLayer.vectorLayer.getSource().addFeature(newMapFeature)

            let newFeature;
            //Add feature to this.features
            if (geometryType == "Point") {
                newFeature = {
                    "schoolName": schoolName,
                    "numOfRiders": numOfRiders,
                    "isAnchorSchool": isAnchorSchool,
                    "featureId": featureId,
                    "geometryType": geometryType,
                    "region": region
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
        * 
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
        * Function to add a school from the list of IHSA schools to the map. This function will be called to add all schools when the page loads
        */
        addSchool(selectedSchool) {
            const lat = selectedSchool.LookAt.latitude
            const lon = selectedSchool.LookAt.longitude
            const coordinates = [lon, lat]

            
            this.createdSchools.add(selectedSchool.Snippet)
            const newSchool = {
                "geometryType":"Point", 
                "featureId":null, 
                "schoolName": selectedSchool.Snippet, 
                "coordinates":coordinates, 
                "numOfRiders":0,
                "isAnchorSchool":false,
                "region": Math.floor(Math.random() * 5) + 1
            }

            // const school = this.loadFeature(newSchool)
            this.loadFeature(newSchool)
            this.cleanSelectedFeatures()
        },

        /**
        * Function to get all points inside a polygon(region).
        * @param {Feature} myPolygon. Feature object of the polygon to get the points inside to.
        * 
        * @return {Array[Feature]}. List of points inside the polygon/region.
        */
        getPointsInsidePolygon(myPolygon) {
            var points = [];
            const getGeometryType = this.getTypeFromFeature //For some reason this turns undefined inside forEachFeatureIntersectingExtent. So, I am saving this function here
            const source = this.$refs.vectorLayer.vectorLayer.getSource()
            source.forEachFeatureIntersectingExtent(myPolygon.getGeometry().getExtent(), function (feature) {
                if (getGeometryType(feature) == 'Point' && myPolygon.getGeometry().intersectsCoordinate(feature.getGeometry().getCoordinates())) {
                    points.push(feature);
                }
            });
            return points;
        },


        /**
        * Function to get all schools inside a polygon(region).
        * @param {Feature} myPolygon. Feature object of the polygon to get the points inside to.
        * 
        * @return {Array[Object]}. List of schools inside the polygon/region.
        */
        getSchoolsInsidePolygon(myPolygon) {
            const points = this.getPointsInsidePolygon(myPolygon)
            const schools = points.map((point) => this.features.schools[point.id_])
            return schools
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