<template>
    <div class="d-flex flex-column flex-grow-1 m-3 align-items-center justify-content-center">
        <h3 class="pt-1">Riders:
            <button class="btn" role="button" data-bs-toggle="tooltip" data-bs-placement="top"
                title="Click here for more info">
                <font-awesome-icon role="button" data-bs-toggle="modal" data-bs-target="#infoModal" class="icon"
                    icon="fa-solid fa-circle-info" />
            </button>
        </h3>
        <div class="mb-3 d-flex w-75 align-items-center justify-content-between">
            <div class="d-flex">
                <input class="form-control" type="file" id="ridersFile" accept=".csv">
                <button type="button" class="btn btn-primary" @click="handleRidersFileUpload">Submit</button>
            </div>
            <select v-model="selectedClass" class="form-select w-25" aria-label="Default select example">
                <option value="null" selected>Select a class</option>
                <option v-for="ridingClass in availableRidingClasses" :key="ridingClass"><a class="dropdown-item"
                        href="#">{{ ridingClass }}</a></option>
            </select>
        </div>
        <div class="mb-3 d-flex w-75 flex-column justify-content-start">
            <table class="table table-striped border border-primary" v-for="section_id in getFilteredClasses"
                :key="section_id">
                <thead class="table-dark">
                    <tr>
                        <th scope="col" colspan="4">
                            {{ ridersData[section_id].showClass }} - {{ classToName[ridersData[section_id].class] }} - {{
                                ridersData[section_id].section }}
                        </th>
                    </tr>
                    <tr>
                        <th scope="col" class="bg-white text-dark">Name</th>
                        <th scope="col" class="bg-white text-dark">School</th>
                        <th scope="col" class="bg-white text-dark">Is Height</th>
                        <th scope="col" class="bg-white text-dark">Is Weight</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="rider in ridersData[section_id].riders" :key="rider.id">
                        <td>{{ rider.name }}</td>
                        <td>{{ rider.school }}</td>
                        <td><input type="checkbox" v-model="rider.isHeight"></td>
                        <td><input type="checkbox" v-model="rider.isWeight"></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <br>
        <br>
    </div>

    <!-- Information modal -->
    <div class="modal fade" id="infoModal" tabindex="-1" aria-labelledby="infoModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <header>CSV format nformation</header>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body fs-5 p-5">
                    Download csv template <a class="fs-5" :href="`${publicPath}RidersListTemplate.csv`"
                        download>here</a><br /><br />
                    <section class="fs-5 text-start">
                        To avoid any errors try to follow the template format as much as possible. However, here is a list
                        of important rules to keep in mind:<br /><br />
                        <ul>
                            <li class="pb-1 fs-6 text-start">First column of section headers (section headers mean the row
                                above the row with the first rider of a section)
                                should contain show class in the format 'Show Class (Number here)'. E.g. 'Show Class 1'
                            </li>
                            <li class="pb-1 fs-6 text-start">
                                Second column of section headers should contain rider class in the format 'Rider Class (id
                                here)'. E.g. 'Rider Class 12a'.
                                Here is a list of all the available class ids and what their corresponding class is
                                <ul>
                                    <li class="fs-6 text-start" v-for="(className, classId) in classToName" :key="classId">
                                        {{ classId }}: {{ className }}
                                    </li>
                                </ul>
                            </li>
                            <li class="pb-1 fs-6 text-start">If a class has multiple sections (like Section A and Section B,
                                etc..),
                                the second column of section headers should also contain section information in the format
                                'Section (uppercase letter here)'. E.g. 'Section A'.
                            </li>
                            <li class="pb-1 fs-6 text-start">
                                There should be at least one row between the last row of a section (the row right below the
                                last rider for the section) and the first row of the next section
                                (the header row). Preferably keep the empty placements in that row. E.g. "1. _________ 2.
                                _________ 3. _________ 4. _________ 5. _________ 6. _________"
                            </li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
import Papa from 'papaparse';
import { useStore } from 'vuex'
import { reactive, ref } from 'vue'
import { Tooltip } from 'bootstrap';

export default {
    setup() {
        const store = useStore()
        const templateInfo = "Click here to see format rules and access a csv template."
        let file = null
        let data = null
        let ridersData = reactive(store.state.eventRiders)
        let classToName = store.state.classToName
        let selectedClass = ref("null")
        return {
            file,
            data,
            ridersData,
            classToName,
            publicPath: process.env.BASE_URL,
            templateInfo,
            selectedClass
        }
    },
    mounted() {
        // Activate bootstrap tooltips
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new Tooltip(tooltipTriggerEl)
        })
    },
    computed: {
        getFilteredClasses() {
            const section_ids = Object.keys(this.ridersData)
            // return section_ids
            let filtered_sections = section_ids.filter((section_id) => this.ridersData[section_id]['riders'].length > 0)
            if (this.selectedClass != "null") {
                return filtered_sections.filter((section_id) => this.selectedClass == this.classToName[this.ridersData[section_id].class])
            } else {
                return filtered_sections
            }
        },

        availableRidingClasses() {
            const section_data = Object.values(this.ridersData)
            // return section_ids
            return [...new Set(section_data.map((section_data) => this.classToName[section_data.class]))]
        }
    },
    name: 'manageEventRiders',
    methods: {
        handleRidersFileUpload() {
            for (let section_id in this.ridersData) {
                this.ridersData[section_id].riders = [];
            }
            try {
                var files = document.getElementById("ridersFile").files
                this.parseFile(files[0], this.ridersDataToJson)
            } catch (err) {
                this.$notify({
                    title: 'Error',
                    text: `Error parsing file`,
                    type: 'error'
                });
            }
        },

        parseFile(file, dataToJson) {
            Papa.parse(file, {
                header: false,
                complete: result => {
                    dataToJson(result.data)
                }
            })
        },

        ridersDataToJson(data) {
            const classRegex = /Class\s\d{1,2}[AB]?/i;
            const sectionRegex = /Section [A-Z]/i;
            let readData = false
            let currClass = null
            let currSection = null
            let showClass = null
            let section_id = null;
            for (let row of data) {
                if (!readData) {
                    let classMatch = classRegex.exec(row[1])
                    let sectionMatch = sectionRegex.exec(row[1])
                    if (classMatch !== null) {
                        readData = true
                        currClass = classMatch[0].toUpperCase()
                        currSection = sectionMatch !== null ? sectionMatch[0].toUpperCase() : 'SECTION A'
                        showClass = row[0].toUpperCase()
                        section_id = `${currClass} ${currSection}`
                        this.ridersData[section_id] = { 'showClass': showClass, 'class': currClass, 'section': currSection, 'riders': [] }
                    }
                } else {
                    if (!(row[0]) || (row[0] && row[0].length != 3)) {
                        readData = false
                    } else {
                        let student = { 'id': row[0], 'name': row[1], 'school': row[4], 'placing': null, 'isHeight': false, 'isWeight': false }
                        this.ridersData[section_id].riders.push(student)
                    }
                }
            }

            const totalRiders = Object.values(this.ridersData).reduce((total, sectionData) => total + sectionData.riders.length, 0);

            if (totalRiders == 0) {
                this.$notify({
                    title: 'Error',
                    text: `Error loading riders`,
                    type: 'error'
                });
            } else {
                this.$notify({
                    title: 'Success',
                    text: `Riders uploaded succesfully`,
                    type: 'success'
                });
            }

            this.postRiders()
        },


        postRiders() {
            let ridersData = []

            for (let classData of Object.values(this.ridersData)) {
                ridersData = ridersData.concat(classData.riders)
            }

            let postData = ridersData.map((rider) => {
                let names = rider.name.split(" ")
                let riderObj = {
                    "username": `${rider.name}`,
                    "firstName": names[0],
                    "lastName": names.length > 1 ? names[names.length - 1] : "",
                    "email": "",
                    "riderId": rider.id,
                    "isHeightRider": rider.isHeight,
                    "isWeightRider": rider.isWeight,
                    "height": 0,
                    "weight": 0,
                    "managedBy": [
                        0
                    ],
                    "playsFor": rider.school
                }
                return riderObj
            })
            this.$axios.post('/Rider/BatchCreate', postData)

        }

    }
}
</script>
  
<style scoped>
#collapseRiders {
    display: flex;
}

.collapse:not(.show) {
    display: none !important;
}

.icon {
    height: 15px;
    width: 15px;
}

/* hover state */
/* .icon:hover {
    transform: scale(1.3);
} */</style>