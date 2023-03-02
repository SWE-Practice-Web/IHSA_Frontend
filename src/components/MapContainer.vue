<template>
    <div class="mapContainer">
        <ol-map :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true" class="child1" ref="map">

            <ol-view ref="view" :center="center" :rotation="rotation" :zoom="zoom" :projection="projection" />

            <ol-tile-layer>
                <ol-source-osm />
            </ol-tile-layer>

            <ol-interaction-select  @select="handleClick" :toggleCondition="never" :condition="clickFeature" :filter="selectInteractionFilter"
                ref="click">
                <ol-style>
                    <ol-style-icon v-if="selectOn || deleteOn" :src="handleMarker()" :scale="0.4"></ol-style-icon>
                </ol-style>
            </ol-interaction-select>

            <ol-interaction-select @select="showTooltip" :condition="pointerMove" :filter="preventHoverOnSelectedFeature"
                ref="hover">
                <ol-style>
                    <ol-style-icon v-if="selectOn || deleteOn" :src="blackMarker" :scale="0.3"></ol-style-icon>
                </ol-style>
            </ol-interaction-select>

            <ol-vector-layer ref="vectorLayer">
                <ol-source-vector :projection="projection">
                </ol-source-vector>
            </ol-vector-layer>

            <ol-overlay ref="tooltip" :offset="[10, -20]" :positioning="tooltipPositioning">
                <div class="overlay-content" id="tooltipContent" style="width: 100px;">
                </div>
            </ol-overlay>
        </ol-map>
        <div class="child2">
            <div class="SchoolInfo" style="border:1px black solid;height:25%">
                <div v-if="selectedFeature.schoolName !== undefined">School Name <input type="text" @input="updateSchoolInfo"
                        v-model="selectedFeature.schoolName"></div><br>
                <div v-if="selectedFeature.numOfRiders !== undefined">Number of Riders <input type="number" @input="updateSchoolInfo" @change="preventEmptyNumber(selectedFeature)"
                        v-model="selectedFeature.numOfRiders"></div><br>
                <div v-if="selectedFeature.isAnchorSchool !== undefined">Is Anchor School <input type="checkbox" @change="updateSchoolInfo"
                        v-model="selectedFeature.isAnchorSchool"></div><br>
                <div v-if="selectedFeature.region !== undefined">
                    Region
                    <select v-model="selectedFeature.region" @change="changeRegion">
                        <option v-for="region in regions" :value="region" :key="region">{{ region }}</option>
                    </select>
                </div>
            </div>
            <div style="border:1px black solid;height:75%">
                <div class="regionInfo">
                    <div>
                        Region
                        <select v-model="selectedRegion" @change="getInformationForRegion">
                            <option v-for="region in regions" :value="region" :key="region">{{ region }}</option>
                        </select>
                    </div>
                    <div>Schools: {{ numOfSchoolsInRegion }}</div>
                    <div>Riders: {{ numOfRidersInRegion }}</div>
                    <div>Anchoor Schools: {{ anchoorSchoolsInRegion }}</div>
                    <div>Avg Mileage: {{ Math.round(avgDistanceInRegion * 100) / 100 }}</div>
                </div>
                <table class="regionTable">
                    <thead>
                        <tr>
                            <th>School</th>
                            <th>Riders</th>
                            <th>Anchoor School</th>
                            <th>Average Distance</th>
                            <th>Maximum Distance</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="school in schoolsInSelectedRegion()" :key="school.featureId">
                            <td><a class='kinda-link' @click='selectSchoolInMap(school.featureId)'>{{ school.schoolName }}</a></td>
                            <td>{{ school.numOfRiders == "" ? 0 : school.numOfRiders }}</td>
                            <td>{{ school.isAnchorSchool ? 'yes' : 'no' }}</td>
                            <td>{{ Math.round(school.avgMileageInRegion * 100) / 100 }}</td>
                            <td>{{ Math.round(school.maxMileageInRegion * 100) / 100 }}</td>
                        </tr>
                    </tbody>
                </table>
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
import { getLength } from 'ol/sphere'
import Control from 'ol/control/Control'
import { never } from 'ol/events/condition'

import ihsa_schools from '../../public/schools.json'
import {
    ref,
    inject
} from 'vue'
export default {
    setup() {
        const center = ref([-87.86, 42.45])
        const projection = ref('EPSG:4326')
        const zoom = ref(7)
        const rotation = ref(0)
        const schools = ref({})
        const features = ref({})
        const geom = inject('ol-geom');
        const Feature = inject('ol-feature');
        const selectConditions = inject('ol-selectconditions')
        const pointerMove = selectConditions.pointerMove;
        const clickFeature = selectConditions.click;
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
        let avgDistanceInRegion = ref(0)
        let anchoorSchoolsInRegion = ref(0)

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
            clickFeature,
            pointerMove,
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
            distancesInRegion,
            avgDistanceInRegion,
            anchoorSchoolsInRegion,
            never
        }
    },

    mounted() {
        for (let school of this.ihsa_schools) {
            this.addSchool(school)
        }
        // Generate list of distances from a school to every other school for all schools. Add it as property of school.
        this.getDistancesForSchools()
        // Get info for region
        this.getInformationForRegion()
        // Generate color map of regions and add it to top right corner
        this.generateColorMap()
    },

    methods: {

        preventEmptyNumber(school) {
            school.numOfRiders = school.numOfRiders == '' ? 0 : school.numOfRiders
        },

        updateSchoolInfo() {
            if (this.selectedFeature.region == this.selectedRegion) {
                this.getInformationForRegion()
            }
        },

        schoolsInSelectedRegion() {
            const schools = Object.values(this.schools)
            return schools.filter(school => school.region == this.selectedRegion)
        },

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
            this.getInformationForRegion()
            const newRegion = evt.target.value
            const newStyle = new Style.Style({
                image: new Style.Icon({
                    src: newRegion !== null ? this.regionToMarker[newRegion] : this.blackMarker,
                    scale: 0.3
                })
            })
            this.cleanSelectedFeatures()
            this.lastSelectedFeature.setStyle(newStyle)
            this.manuallySelectFeature(this.lastSelectedFeature)
            
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
                // console.log(feature)
                this.lastSelectedFeature = feature
                if (this.selectOn) { this.selectFeature(feature) }
                else if (this.deleteOn) { this.deleteFeature(feature) }
            } else if (evt && evt.deselected && evt.deselected.length) {
                this.cleanSelectedFeatures()
                this.manuallySelectFeature(evt.deselected[0])
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

        selectSchoolInMap(featureId) {
            this.center = this.features[featureId].getGeometry().getCoordinates()
            this.selectedFeature = this.schools[featureId]
            this.lastSelectedFeature = this.features[featureId]
            this.cleanSelectedFeatures()
            this.manuallySelectFeature(this.features[featureId])
        },



        /**
        * Function to handle clicks when 'Edit Elements' checkbox is selected.
        *
        * @param {Feature} feature. Feature being clicked on
        */
        selectFeature(feature) {
            this.selectedFeature = this.schools[feature.id_]
        },


        manuallySelectFeature(feature) {
            this.$refs.click.select.getFeatures().push(feature)
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
        selectInteractionFilter(feature) {
            return feature.id_
        },


        preventHoverOnSelectedFeature(feature) {
            if (this.lastSelectedFeature) {
                return !(this.lastSelectedFeature.id_ == feature.id_)
            } else {
                return true
            }
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
            let { geometryType, featureId, coordinates, schoolName, numOfRiders, isAnchorSchool, region, distances, avgMileageInRegion, maxMileageInRegion } = feature;
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
                "coordinates": coordinates,
                "featureId": featureId,
                "geometryType": geometryType,
                "region": region,
                "distances": distances,
                "avgMileageInRegion": avgMileageInRegion,
                "maxMileageInRegion": maxMileageInRegion
            }
            this.selectedFeature = newFeature
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
            this.$refs.click.select.getFeatures().clear()
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
                "region": selectedSchool.region,
                "distances": {},
                "avgMileageInRegion": 0,
                "maxMileageInRegion": 0,
            }
            this.loadFeature(newSchool)
        },

        getInformationForRegion() {
            const region = this.selectedRegion
            this.anchoorSchoolsInRegion = 0
            let regionSchools = []
            for (let [key, value] of Object.entries(this.schools)) {
                let school = value
                school['featureId'] = key
                if (school.region == region) {
                    regionSchools.push(school)
                    if (school.isAnchorSchool) { 
                        this.anchoorSchoolsInRegion += 1
                    }
                }
            }
            this.numOfSchoolsInRegion = regionSchools.length
            //Need to filter null values here later
            this.numOfRidersInRegion = this.sum(regionSchools.map(school => this.getInt(school.numOfRiders)))
            this.distancesInRegion = this.getDistances(regionSchools.map(school => school.featureId))
            this.avgDistanceInRegion = this.sum(this.distancesInRegion) / this.distancesInRegion.length
        },

        sum(arr) {
            return arr.reduce((a, b) => a + b, 0);
        },

        getInt(obj) {
            return obj === "" ? 0 : parseInt(obj)
        },

        getDistances(featuresIds) {
            let distances = []
            let schoolTotalDistances = new Array(featuresIds.length).fill(0);
            let schoolMaxDistances = new Array(featuresIds.length).fill(0);
            for (let i = 0; i < featuresIds.length - 1; i++) {
                for (let j = i + 1; j < featuresIds.length; j++) {
                    const featureId1 = featuresIds[i]
                    const featureId2 = featuresIds[j]
                    const currDistanceInMiles = this.schools[featureId1]['distances'][featureId2]
                    distances.push(currDistanceInMiles)
                    if (this.schools[featureId1].region == this.schools[featureId2].region){
                        schoolTotalDistances[i] += currDistanceInMiles
                        schoolTotalDistances[j] += currDistanceInMiles
                        schoolMaxDistances[i] = Math.max(schoolMaxDistances[i], currDistanceInMiles)
                        schoolMaxDistances[j] = Math.max(schoolMaxDistances[j], currDistanceInMiles)
                    }
                }
            }
            for (let i = 0; i < featuresIds.length; i++) {
                const featureId = featuresIds[i]
                this.schools[featureId]['maxMileageInRegion'] = schoolMaxDistances[i]
                this.schools[featureId]['avgMileageInRegion'] = schoolTotalDistances[i] / (featuresIds.length - 1)
            }
            return distances
        },

        // Generate list of distances from a school to every other school for all schools. Add it as property of school.
        getDistancesForSchools() {
            const featuresIds = Object.keys(this.schools).map(id => parseInt(id))
            for (let i = 0; i < featuresIds.length - 1; i++) {
                for (let j = i + 1; j < featuresIds.length; j++) {
                    const feature1 = this.features[featuresIds[i]]
                    const feature2 = this.features[featuresIds[j]]
                    const point1 = feature1.getGeometry()
                    const point2 = feature2.getGeometry()
                    const line = new this.geom.LineString([point1.getCoordinates(), point2.getCoordinates()])
                    const options = { 'projection': 'EPSG:4326' }
                    const length = getLength(line, options)
                    const currDistance = length / 1000
                    const currDistanceInMiles = currDistance / 1.609
                    this.schools[featuresIds[i]]['distances'][featuresIds[j]] = currDistanceInMiles
                    this.schools[featuresIds[j]]['distances'][featuresIds[i]] = currDistanceInMiles
                }
            }
        },

        generateColorMap() {
            const container = document.createElement('div');
            container.className = 'ol-control-panel ol-unselectable';
            container.style = "background-color:rgba(255,255,255,0.8);display:inline-block;padding:2px;position:fixed;top:10;left:0"

            const redContainer = document.createElement('div');
            const brownContainer = document.createElement('div');
            const greenContainer = document.createElement('div');
            const blueContainer = document.createElement('div');
            const lightBlueContainer = document.createElement('div');

            redContainer.style = "display:flex"
            brownContainer.style = "display:flex"
            greenContainer.style = "display:flex"
            blueContainer.style = "display:flex"
            lightBlueContainer.style = "display:flex"

            redContainer.innerHTML = "<div style='height:10px;width:10px;background-color:#ff5454'></div>&nbspRegion 1"
            brownContainer.innerHTML = "<div style='height:10px;width:10px;background-color:#50342c'></div>&nbspRegion 2"
            greenContainer.innerHTML = "<div style='height:10px;width:10px;background-color:#28cc94'></div>&nbspRegion 3"
            blueContainer.innerHTML = "<div style='height:10px;width:10px;background-color:#1034bc'></div>&nbspRegion 4"
            lightBlueContainer.innerHTML = "<div style='height:10px;width:10px;background-color:#d05cec'></div>&nbspRegion 5"
            // yellowContainer.innerHTML = "<div style='height:10px;width:10px;background-color:#e8fc54'></div>&nbspRegion 5"
            container.appendChild(redContainer)
            container.appendChild(brownContainer)
            container.appendChild(greenContainer)
            container.appendChild(blueContainer)
            container.appendChild(lightBlueContainer)
            /*A custom control which has container holding input elements etc*/
            var controlPanel = new Control({
                element: container
            });
            this.$refs.map.map.addControl(controlPanel)
        }
    }
}
</script>
<style scoped>
.mapContainer {
    display: grid;
    grid-template-columns: 60% 40%;
    height: 93vh;
    width: 100vw;
}

.child1 {
    grid-column: 1;
}

.child2 {
    grid-column: 2;
    height: 93vh;
    background-color: lightgray;
}

.overlay-content {
    background: #efefef;
    box-shadow: 0 5px 10px rgb(2 2 2 / 20%);
    padding: 10px 20px;
    font-size: 16px;
}

table {
    height: 80%;
    display: inline-block;
    overflow-y: scroll;
}

th,
td {
    padding: 0.5rem 0.3rem;
    border: 1px black solid;
}

thead {
    background: #eee;
}

thead {
    position: sticky;
    top: 0;
    border-bottom: 2px solid #ccc;
}

.regionInfo {
    height: 10%;
    display: flex;
    justify-content: space-around;
    background-color: #eee;
    /* padding: 1rem 0.1rem; */
    border: 1px black solid;
}

.regionInfo  > div{
    flex-grow: 1;
    padding: 1rem 0.1rem;
    border: 1px black solid;
}

.regionTable {
    height: 89%;
    width: 100%;
}

a.kinda-link:hover { cursor: pointer; text-decoration: underline;}
.kinda-link {
    color:blue
}
</style>