<template>
    <div class="mapContainer">
        <ol-map :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true" class="child1" ref="map">

            <ol-view ref="view" :center="center" :rotation="rotation" :zoom="zoom" :projection="projection" />

            <ol-tile-layer>
                <ol-source-osm />
            </ol-tile-layer>

            <ol-interaction-select @select="handleClick" :toggleCondition="never" :condition="clickFeature"
                :filter="selectInteractionFilter" ref="click">
                <ol-style>
                    <ol-style-icon v-if="selectOn || deleteOn" :src="handleSelectMarker()" :scale="0.5"></ol-style-icon>
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
            <div class="container d-grid" style="border:1px black solid;height:20%; align-content: space-evenly;">
                <div class="row m-1">
                    <div class="col-8 d-flex">
                        <span class="fw-bold mx-2 mt-1">School Name: </span>
                        <input type="text" @blur="patchSchool" @input="updateSchoolInfo"
                            v-model="selectedFeature.schoolName">
                    </div>
                    <div class="col-4 d-flex">
                        <span class="fw-bold mx-2  mt-1">Is Anchor School: </span>
                        <input type="checkbox" @change="updateSchoolInfo(); updateMarker(selectedFeature); patchSchool()"
                            v-model="selectedFeature.isAnchorSchool">
                    </div>
                </div>
                <div class="row m-1">
                    <div class="col-8 d-flex">
                        <span class="fw-bold mx-2 mt-1">Number of Riders: </span>
                        <input type="number" @blur="patchSchool" @input="updateSchoolInfo"
                            @change="preventEmptyNumber(selectedFeature)" v-model="selectedFeature.numOfRiders">
                    </div>
                    <div class="col-4 d-flex">
                        <span class="fw-bold mx-2 mt-1">Region: </span>
                        <select v-model="selectedFeature.region" @change="changeRegion($event); patchSchool()">
                            <option v-for="region in ['N/A', ...regions]" :value="region" :key="region">{{ region }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>
            <div style="border:1px black solid;height:80%">
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
                            <td><a class='kinda-link' @click='selectSchoolInMap(school.featureId)'>{{ school.schoolName
                            }}</a></td>
                            <td>{{ school.numOfRiders == "" ? 0 : school.numOfRiders }}</td>
                            <td>{{ school.isAnchorSchool ? 'yes' : 'no' }}</td>
                            <td>{{ Math.round(school.avgMileageInRegion * 100) / 100 }}</td>
                            <td>{{ Math.round(school.maxMileageInRegion * 100) / 100 }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Modal -->
        <div ref="loader" class="modal" id="myModal" tabindex="-1" aria-labelledby="exampleModalLabel" data-bs-backdrop="static" data-bs-keyboard="false"
            aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered d-flex justify-content-center">
                <div class="modal-content">
                    <div class="modal-title fs-4">Loading...</div>
                    <div class="modal-body">
                        <div class="spinner-border" style="width:8rem; height:8rem" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
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
import yellowMarker from '../assets/yellowMarker.png' //Location icon by Icons8

import blackFlagMarker from '../assets/blackFlagMarker.png' //Location icon by Icons8
import redFlagMarker from '../assets/redFlagMarker.png' //Location icon by Icons8
import brownFlagMarker from '../assets/brownFlagMarker.png' //Location icon by Icons8
import greenFlagMarker from '../assets/greenFlagMarker.png' //Location icon by Icons8
import bluedFlagMarker from '../assets/blueFlagMarker.png' //Location icon by Icons8
import lightBlueFlagMarker from '../assets/lightBlueFlagMarker.png' //Location icon by Icons8
import yellowFlagMarker from '../assets/yellowFlagMarker.png' //Location icon by Icons8

import * as Style from 'ol/style/'
import { getLength } from 'ol/sphere'
import Control from 'ol/control/Control'
import { never } from 'ol/events/condition'
import { Modal } from 'bootstrap';

import schools_json from '../../public/schools.json'
import {
    ref,
    reactive,
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
        let loader;
        let ihsa_schools = reactive({})
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
            'N/A': yellowMarker,
            1: redMarker,
            2: brownMarker,
            3: greenMarker,
            4: bluedMarker,
            5: lightBlueMarker
        })

        let regionToMarkerAnchorSchool = ref({
            'N/A': yellowFlagMarker,
            1: redFlagMarker,
            2: brownFlagMarker,
            3: greenFlagMarker,
            4: bluedFlagMarker,
            5: lightBlueFlagMarker
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
            blackFlagMarker,
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
            regionToMarkerAnchorSchool,
            never,
            loader,
            Modal
        }
    },

    async mounted() {
        let schools;
        this.loader = new Modal(this.$refs.loader, {})
        this.loader.show()
        try {
            schools = await this.$axios.get('/school')
            this.ihsa_schools = schools.data
        } catch (err) {
            this.ihsa_schools = schools_json
            this.$notify({
                title: 'Error',
                text: `Error loading schools from database. Showing latest school info saved`,
                type: 'error'
            });
            console.log(err)
            
        } 
        this.loader.hide()
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


        async patchSchool() {
            let school = {
                "id": this.selectedFeature.schoolId,
                "schoolName": this.selectedFeature.schoolName,
                "stateCode": this.selectedFeature.stateCode,
                "latitude": this.selectedFeature.coordinates[1],
                "longitude": this.selectedFeature.coordinates[0],
                "region": this.selectedFeature.region,
                "zone": this.selectedFeature.zone,
                "numRiders": this.selectedFeature.numOfRiders,
                "anchorSchool": this.selectedFeature.isAnchorSchool
            }
            try {
                await this.$axios.put(`school/${school.id}`, school)
            } catch (err) {
                console.log(err)
                this.$notify({
                    title: 'Error',
                    text: `Error updating school info: ${err}`,
                    type: 'error'
                });
            }
        },

        /**
        * Function to show a 0 instead of an empty box when inputs of type=number are being edited
        *
        * @param {object} school. School being updated
        */
        preventEmptyNumber(school) {
            school.numOfRiders = school.numOfRiders == '' ? 0 : school.numOfRiders
        },



        /**
        * Function being called whenever the school information is updated. It updates the information of the region
        * that contains that school
        *
        * @param {object} school. School being updated
        */
        updateSchoolInfo() {
            if (this.selectedFeature.region == this.selectedRegion) {
                this.getInformationForRegion()
            }
        },



        /**
        * Function to get all schools in the current selected region.
        *
        */
        schoolsInSelectedRegion() {
            const schools = Object.values(this.schools)
            return schools.filter(school => school.region == this.selectedRegion)
        },



        /**
        * Function to handle hover on the map. If the mouse is hovering over a school, it displays a tooltip with 
        * the school information
        *
        * @param {Event} evt. Hover event being emitted.
        */
        showTooltip(evt) {
            let feature;
            if (evt.selected && evt.selected.length) {
                feature = evt.selected[0]
                this.$refs.tooltip.setPosition(feature.getGeometry().getCoordinates())
                document.getElementById("tooltipContent").innerText = this.schools[feature.id_].schoolName
                if (this.schools[feature.id_].isAnchorSchool) {
                    const newStyle = new Style.Style({
                        image: new Style.Icon({
                            src: blackFlagMarker,
                            scale: 0.6
                        })
                    })
                    feature.setStyle(newStyle)
                }
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

        updateMarker(school) {
            let marker;
            let scale;
            if (school.isAnchorSchool) {
                marker = school.region !== null ? this.regionToMarkerAnchorSchool[school.region] : this.yellowFlagMarker
                scale = 0.5
            } else {
                marker = school.region !== null ? this.regionToMarker[school.region] : this.yellowMarker
                scale = 0.3
            }
            const newStyle = new Style.Style({
                image: new Style.Icon({
                    src: marker,
                    scale: scale
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
                this.lastSelectedFeature = feature
                if (this.selectOn) { this.selectFeature(feature) }
                else if (this.deleteOn) { this.deleteFeature(feature) }
            } else if (evt && evt.deselected && evt.deselected.length) {
                this.cleanSelectedFeatures()
                this.manuallySelectFeature(evt.deselected[0])
            }
        },

        handleSelectMarker() {
            if (this.lastSelectedFeature == null) {
                return this.blackMarker
            } else {
                let feature = this.lastSelectedFeature
                if (!(feature.id_ in this.schools)) {
                    return this.blackMarker
                }
                const selectedSchool = this.schools[feature.id_]
                const region = selectedSchool.region
                if (selectedSchool.isAnchorSchool) { return region !== null ? this.regionToMarkerAnchorSchool[region] : this.yellowFlagMarker }
                else { return region !== null ? this.regionToMarker[region] : this.yellowMarker }
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
                if (this.lastSelectedFeature.id_ == feature.id_) {
                    const evt = {}
                    evt.selected = [feature]
                    this.showTooltip(evt)
                    return false
                } else {
                    return true
                }
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
            let { geometryType, featureId, coordinates, schoolName, numOfRiders, isAnchorSchool,
                region, distances, avgMileageInRegion, maxMileageInRegion, schoolId, zone, stateCode } = feature;
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
                let marker;
                let scale;
                if (isAnchorSchool) {
                    marker = region !== null ? this.regionToMarkerAnchorSchool[region] : this.yellowFlagMarker
                    scale = 0.5
                } else {
                    marker = region !== null ? this.regionToMarker[region] : this.yellowMarker
                    scale = 0.3
                }
                const iconStyle = new Style.Style({
                    image: new Style.Icon({
                        src: marker,
                        scale: scale
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
                "schoolId": schoolId,
                "numOfRiders": numOfRiders,
                "isAnchorSchool": isAnchorSchool,
                "coordinates": coordinates,
                "featureId": featureId,
                "geometryType": geometryType,
                "region": region,
                "distances": distances,
                "avgMileageInRegion": avgMileageInRegion,
                "maxMileageInRegion": maxMileageInRegion,
                "zone": zone,
                "stateCode": stateCode,
            }
            this.selectedFeature = newFeature
            this.schools[featureId] = newFeature
            this.lastSelectedFeature = newMapFeature
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
            const lat = selectedSchool.latitude
            const lon = selectedSchool.longitude
            const coordinates = [lon, lat]


            this.createdSchools.add(selectedSchool.schoolName)
            const newSchool = {
                "geometryType": "Point",
                "featureId": null,
                "schoolId": selectedSchool.id,
                "schoolName": selectedSchool.schoolName,
                "coordinates": coordinates,
                "numOfRiders": selectedSchool.numRiders,
                "isAnchorSchool": selectedSchool.anchorSchool,
                "region": selectedSchool.region,
                "zone": selectedSchool.zone,
                "stateCode": selectedSchool.stateCode,
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
            let anchorSchools = 0
            let schoolTotalDistances = new Array(featuresIds.length).fill(0);
            let schoolMaxDistances = new Array(featuresIds.length).fill(0);
            for (let i = 0; i < featuresIds.length; i++) {
                const featureId1 = featuresIds[i]
                if (this.schools[featureId1].isAnchorSchool) {
                    anchorSchools += 1
                    distances.push(0)
                }
                for (let j = 0; j < featuresIds.length; j++) {
                    if (i == j) {
                        continue
                    }
                    const featureId2 = featuresIds[j]
                    const currDistanceInMiles = this.schools[featureId1]['distances'][featureId2]
                    const sameRegion = (this.schools[featureId1].region == this.schools[featureId2].region)
                    const isAnchorSchool = this.schools[featureId2].isAnchorSchool
                    if (sameRegion && isAnchorSchool) {
                        distances.push(currDistanceInMiles)
                        schoolTotalDistances[i] += currDistanceInMiles
                        schoolMaxDistances[i] = Math.max(schoolMaxDistances[i], currDistanceInMiles)
                    }
                }
            }
            for (let i = 0; i < featuresIds.length; i++) {
                const featureId = featuresIds[i]
                this.schools[featureId]['maxMileageInRegion'] = schoolMaxDistances[i]
                this.schools[featureId]['avgMileageInRegion'] = schoolTotalDistances[i] / anchorSchools
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

            const yellowContainer = document.createElement('div');
            const redContainer = document.createElement('div');
            const brownContainer = document.createElement('div');
            const greenContainer = document.createElement('div');
            const blueContainer = document.createElement('div');
            const lightBlueContainer = document.createElement('div');
            const flag = document.createElement('div');

            yellowContainer.style = "display:flex"
            redContainer.style = "display:flex"
            brownContainer.style = "display:flex"
            greenContainer.style = "display:flex"
            blueContainer.style = "display:flex"
            lightBlueContainer.style = "display:flex"

            yellowContainer.innerHTML = "<div style='height:12px;width:12px;background-color:#ffff00'></div>&nbspNo Region"
            redContainer.innerHTML = "<div style='height:12px;width:12px;background-color:#ff5454'></div>&nbspRegion 1"
            brownContainer.innerHTML = "<div style='height:12px;width:12px;background-color:#50342c'></div>&nbspRegion 2"
            greenContainer.innerHTML = "<div style='height:12px;width:12px;background-color:#28cc94'></div>&nbspRegion 3"
            blueContainer.innerHTML = "<div style='height:12px;width:12px;background-color:#1034bc'></div>&nbspRegion 4"
            lightBlueContainer.innerHTML = "<div style='height:12px;width:12px;background-color:#d05cec'></div>&nbspRegion 5"
            flag.innerText = "Flag: Anchor Schools"
            // yellowContainer.innerHTML = "<div style='height:10px;width:10px;background-color:#e8fc54'></div>&nbspRegion 5"
            container.appendChild(yellowContainer)
            container.appendChild(redContainer)
            container.appendChild(brownContainer)
            container.appendChild(greenContainer)
            container.appendChild(blueContainer)
            container.appendChild(lightBlueContainer)
            container.appendChild(flag)
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

.regionInfo>div {
    flex-grow: 1;
    padding: 1rem 0.1rem;
    border: 1px black solid;
}

.regionTable {
    height: 89%;
    width: 100%;
}

a.kinda-link:hover {
    cursor: pointer;
    text-decoration: underline;
}

.kinda-link {
    color: blue
}
</style>