<template>
    <div class="container">
        <ol-map :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true" class="child1" ref="map">

            <ol-view ref="view" :center="center" :rotation="rotation" :zoom="zoom" :projection="projection" />

            <ol-tile-layer>
                <ol-source-osm />
            </ol-tile-layer>

            <ol-interaction-select @select="handleClick" :condition="selectCondition" :filter="selectInteractionFilter"
                ref="select">
                <ol-style>
                    <ol-style-icon v-if="selectOn || deleteOn" :src="handleMarker()" :scale="0.4"></ol-style-icon>
                </ol-style>
            </ol-interaction-select>

            <ol-interaction-select @select="showTooltip" :condition="selectCondition2" :filter="selectInteractionFilter"
                ref="select">
                <ol-style>
                    <ol-style-icon v-if="selectOn || deleteOn" :src="blackMarker" :scale="0.3"></ol-style-icon>
                </ol-style>
            </ol-interaction-select>

            <ol-vector-layer ref="vectorLayer">
                <ol-source-vector :projection="projection">

                </ol-source-vector>

                <ol-style>
                    <ol-style-stroke color="red" :width="500"></ol-style-stroke>
                    <ol-style-fill color="rgba(255,255,255,0.1)"></ol-style-fill>
                    <ol-style-circle :radius="30">
                        <ol-style-fill color="white"></ol-style-fill>
                    </ol-style-circle>
                    <ol-style-icon :src="blackMarker" :scale="0.2"></ol-style-icon>
                </ol-style>

            </ol-vector-layer>

            <ol-overlay ref="tooltip" :offset="[10, -20]" :positioning="tooltipPositioning">
                <div class="overlay-content" id="tooltipContent" style="width: 100px;">
                </div>
            </ol-overlay>
        </ol-map>
        <div style="background-color: lightgray;" class="child2">
            <div class="SchoolInfo" style="border:3px red solid;height:30%">
                <div v-if="selectedFeature.schoolName !== undefined">School Name <input type="text"
                        v-model="selectedFeature.schoolName"></div><br>
                <div v-if="selectedFeature.numOfRiders !== undefined">Number of Riders <input type="text"
                        v-model="selectedFeature.numOfRiders"></div><br>
                <div v-if="selectedFeature.isAnchorSchool !== undefined">Is Anchor School <input type="checkbox"
                        v-model="selectedFeature.isAnchorSchool"></div><br>
                <div v-if="selectedFeature.region !== undefined">
                    Region
                    <select v-model="selectedFeature.region" @change="changeRegion">
                        <option v-for="region in regions" :value="region" :key="region">{{ region }}</option>
                    </select>
                </div>
            </div>
            <div class="RegionInfo" style="border:3px red solid;height:70%">
                Region
                <select v-model="selectedRegion" @change="getInformationForRegion">
                    <option v-for="region in regions" :value="region" :key="region">{{ region }}</option>
                </select><br>
                Number of Schools <input type="text" :value="numOfSchoolsInRegion"><br>
                Number of Riders <input type="text" :value="numOfRidersInRegion"><br>
                Average Distance <input type="text" :value="distancesInRegion"><br>
            </div>
        </div>
    </div>
</template>

<script>
import blackMarker from '../assets/blackMarker.png' //Location icon by Icons8
import redMarker from '../assets/redMarker.png' //Location icon by Icons8
import brownMarker from '../assets/brownMarker.png' //Location icon by Icons8
import greenMarker from '../assets/greenMarker.png' //Location icon by Icons8
import bluedMarker from '../assets/blueMarker.png' //Location icon by Icons8
import lightBlueMarker from '../assets/lightBlueMarker.png' //Location icon by Icons8
import * as Style from 'ol/style/'
import {getLength} from 'ol/sphere'

import ihsa_schools from '../../public/schools.json'
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
        const schools = ref({})
        const features = ref({})
        const geom = inject('ol-geom');
        const Feature = inject('ol-feature');
        const selectConditions = inject('ol-selectconditions')
        const selectCondition2 = selectConditions.pointerMove;
        const selectCondition = selectConditions.click;
        const regions = ref([1, 2, 3, 4, 5])
        let lastSelectedFeature = ref(null);
        let selectedRegion = ref(1);
        let selectedSchool = ref("Please select a school")
        let role = ref("admin")
        let selectedFeature = ref({})
        let selectOn = ref(true);
        let deleteOn = ref(false);
        let createdSchools = ref(new Set())
        let numOfSchoolsInRegion = ref(0)
        let numOfRidersInRegion = ref(0)
        let distancesInRegion = ref([])
        let regionToMarker = ref({
            1: redMarker,
            2: brownMarker,
            3: greenMarker,
            4: bluedMarker,
            5: lightBlueMarker
        })
        let tooltipPos;
        const tooltipPositioning = ref("bottom-left")


        return {
            center,
            projection,
            zoom,
            rotation,
            selectCondition,
            selectCondition2,
            blackMarker,
            selectOn,
            deleteOn,
            features,
            schools,
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
            regions,
            tooltipPos,
            tooltipPositioning,
            numOfSchoolsInRegion,
            numOfRidersInRegion,
            distancesInRegion
        }
    },

    mounted() {
        for (let school of this.ihsa_schools) {
            this.addSchool(school)
        }
        this.getInformationForRegion()
    },

    methods: {

        showTooltip(evt) {
            let feature;
            if (evt.selected && evt.selected.length) {
                feature = evt.selected[0]
                this.$refs.tooltip.setPosition(feature.getGeometry().getCoordinates())
                document.getElementById("tooltipContent").innerText = this.schools[feature.id_].schoolName
            } else {
                this.$refs.tooltip.setPosition(undefined)
            }
        },

        changeRegion(evt) {
            const newRegion = evt.target.value
            const newStyle = new Style.Style({
                image: new Style.Icon({
                    src: newRegion !== null ? this.regionToMarker[newRegion] : this.blackMarker,
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
                if (!(feature.id_ in this.schools)) {
                    return this.blackMarker
                }
                const selectedSchool = this.schools[feature.id_]
                const region = selectedSchool.region
                return region !== null ? this.regionToMarker[region] : this.blackMarker
            }
        },



        /**
        * Function to handle clicks when 'Edit Elements' checkbox is selected.
        *
        * @param {Feature} feature. Feature being clicked on
        */
        selectFeature(feature) {
            this.selectedFeature = this.schools[feature.id_]
        },



        /**
        * Function to handle clicks when 'Delete Elements' checkbox is selected
        *
        * @param {Feature} feature. Feature being clicked on
        */
        deleteFeature(feature) {
            this.$refs.vectorLayer.vectorLayer.getSource().removeFeature(feature)
            this.createdSchools.delete(this.schools[feature.id_]['schoolName'])
            delete this.schools[feature.id_]
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
            this.deleteOn = false
        },



        /**
        * Function called when the 'Delete Elements' checkbox is clicked. Sets deleteOn to true and all others to false
        */
        toggleDeleteOn() {
            this.cleanSelectedFeatures() //Unselect any selected features beacuse otherwise select doesn't work properly
            this.deleteOn = true
            this.selectOn = false
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
        * Function to add features to the map.
        * It creates and adds a feature to 'this.schools'.
        *
        * @param {Object} feature. Feature generated by this page. The properties of this feature depend on if the feature is a school or region:
        * school: {geometryType, featureId, coordinates, schoolName, numOfRiders, isAnchorSchool}
        * school: {geometryType, featureId, coordinates, regionId}
        * @return {Object} Returns the newly created feature object
        */
        loadFeature(feature) {
            //Load feature properties
            let { geometryType, featureId, coordinates, schoolName, numOfRiders, isAnchorSchool, region } = feature;
            //Add feature to map
            let newGeometry;
            if (geometryType == "Point") {
                newGeometry = new this.geom.Point(coordinates)
            } else {
                newGeometry = new this.geom.Polygon(coordinates)
            }
            const newMapFeature = new this.Feature({ geometry: newGeometry })
            featureId = featureId ? featureId !== null : newMapFeature.ol_uid
            newMapFeature.setId(featureId)
            if (geometryType == "Point") {
                const iconStyle = new Style.Style({
                    image: new Style.Icon({
                        src: region !== null ? this.regionToMarker[region] : this.blackMarker,
                        scale: 0.3
                    })
                })
                newMapFeature.setStyle(iconStyle)
            }
            this.features[featureId] = newMapFeature
            this.$refs.vectorLayer.vectorLayer.getSource().addFeature(newMapFeature)

            let newFeature;
            //Add feature to this.schools
            newFeature = {
                "schoolName": schoolName,
                "numOfRiders": numOfRiders,
                "isAnchorSchool": isAnchorSchool,
                "featureId": featureId,
                "geometryType": geometryType,
                "region": region
            }
            this.schools[featureId] = newFeature
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
            const lat = selectedSchool.lat
            const lon = selectedSchool.lng
            const coordinates = [lon, lat]


            this.createdSchools.add(selectedSchool.raw_name)
            const newSchool = {
                "geometryType": "Point",
                "featureId": null,
                "schoolName": selectedSchool.raw_name,
                "coordinates": coordinates,
                "numOfRiders": selectedSchool.riders,
                "isAnchorSchool": false,
                "region": selectedSchool.region
            }
            this.loadFeature(newSchool)
            this.cleanSelectedFeatures()
        },

        getInformationForRegion() {
            const region = this.selectedRegion
            let regionSchools = []
            for (let [key, value] of Object.entries(this.schools)) {
                let school = value
                school['featureId'] = key
                if (school.region == region) {
                    regionSchools.push(school)
                }
            }
            this.numOfSchoolsInRegion = regionSchools.length
            this.numOfRidersInRegion = this.sum(regionSchools.map(school => school.numOfRiders))
            this.distancesInRegion = this.getDistances(regionSchools.map(school => school.featureId))
            return regionSchools.length
        },

        sum(arr) {
            return arr.reduce((a, b) => a + b, 0);
        },

        getDistances(featuresIds) {
            let distances = []
            for (let i = 0 ; i < featuresIds.length - 1; i ++) {
                for (let j = i+1 ; j < featuresIds.length ; j ++) {
                    const feature1 = this.features[featuresIds[i]]
                    const feature2 = this.features[featuresIds[j]]
                    const point1 = feature1.getGeometry()
                    const point2 = feature2.getGeometry()
                    const line = new this.geom.LineString([point1.getCoordinates(), point2.getCoordinates()])
                    const options = {'projection':'EPSG:4326'}
                    const length = getLength(line, options)
                    const currDistance = Math.round((length / 1000) * 100) / 100
                    distances.push(currDistance)
                }
            }
            const avgDistance = this.sum(distances) / distances.length
            return `${Math.round(avgDistance / 1.609 * 100) / 100} miles`
        }
    }
}
</script>
<style scoped>
.container {
    display: grid;
    grid-template-columns: 70% 30%;
    height: 100vh;
    width: 100vw;
}

.child1 {
    grid-column: 1;
}

.child2 {
    grid-column: 2;
}

.overlay-content {
    background: #efefef;
    box-shadow: 0 5px 10px rgb(2 2 2 / 20%);
    padding: 10px 20px;
    font-size: 16px;
}
</style>