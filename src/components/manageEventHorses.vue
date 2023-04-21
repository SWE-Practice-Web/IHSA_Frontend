<template>
        <div class="d-flex flex-column flex-grow-1 m-3 align-items-center justify-content-center">
            <h3 class="pt-1">
                Horses
                <button v-if="true" class="btn" role="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Click here for more info">
                    <font-awesome-icon role="button" data-bs-toggle="modal" data-bs-target="#infoModal" class="icon" icon="fa-solid fa-circle-info"/>
                </button>
            </h3>
            <div class="mb-3 d-flex w-75 justify-content-between">
                <div class="d-flex">
                    <input class="form-control" type="file" id="horsesFile" accept=".csv">
                    <button type="button" class="btn btn-primary" @click="handleHorsesFileUpload">Submit</button>
                </div>
                <select v-model="selectedClass" class="form-select w-25" aria-label="Default select example">
                    <option value="null" selected>Select a class</option>
                    <option v-for="ridingClass in availableRidingClasses" :key="ridingClass" ><a class="dropdown-item" href="#">{{ ridingClass }}</a></option>
                </select>
            </div>
            <div class="mb-3 d-flex w-75 flex-column justify-content-start">
                    <table class="table table-striped w-90 border border-primary"
                        v-for="section_id in getFilteredSections" :key="section_id">
                        <thead class="table-dark">
                            <tr>
                                <th scope="col" colspan="4">
                                    {{ classToName[horsesData[section_id].class] }} - {{ horsesData[section_id].section }}
                                </th>
                            </tr>
                            <tr>
                                <th scope="col" class="bg-white text-dark">Name</th>
                                <th scope="col" class="bg-white text-dark">Provider</th>
                                <th scope="col" class="bg-white text-dark">Takes Height</th>
                                <th scope="col" class="bg-white text-dark">Takes Weight</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="horse in horsesData[section_id].horses" :key="horse.name">
                                <td>{{ horse.name }}</td>
                                <td>{{ horse.provider }}</td>
                                <td><input type="checkbox" v-model="horse.takesHeight"></td>
                                <td><input type="checkbox" v-model="horse.takesWeight"></td>
                            </tr>
                        </tbody>
                    </table>
            </div>
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
                    Download csv template <a class="fs-5" :href="`${publicPath}HorsesListTemplate.csv`" download>here</a><br/><br/>
                    <section class="fs-5 text-start">
                        To avoid any errors try to follow the template format as much as possible. However, here is a list of important rules to keep in mind:<br/><br/>
                        <ul >
                            <li class="pb-1 fs-6 text-start">First row of the .csv should contain headers. First header should be `Horses` and second header
                                should be `Provider`, following headers should be specific classes/sections
                            </li>
                            <li class="pb-1 fs-6 text-start">
                                Headers for specific classes/sections should contain rider class in the format 'Class (id here)'. E.g. 'Class 12A'. 
                                If the class name includes a letter like `Class 2A` or `Class 2B` make sure that letter is uppercase.
                                Here is a list of all the available class ids and what their corresponding class is
                                <ul>
                                    <li class="fs-6 text-start" v-for="(className, classId) in classToName" :key="classId">
                                        {{classId}}: {{className}}
                                    </li>
                                </ul>
                            </li>
                            <li class="pb-1 fs-6 text-start">If a class has multiple sections (like Section A and Section B, etc..), 
                                the second column of section headers should also contain section information in the format 'Section (uppercase letter here)'. E.g. 'Section A'.
                            </li>
                            <li class="pb-1 fs-6 text-start">After the row corresponding to the last horse there should be no more data.</li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
import Papa from 'papaparse';
import { reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { Tooltip } from 'bootstrap';



export default {
    name: 'manageEventHorses',
    props: ['event'],
    setup(props) {
        const store = useStore()
        let file = null
        let data = null
        let classToName = store.state.classToName
        let selectedClass = ref("null")

        let eventsHorses = reactive(store.state.eventsHorses)
        if (!(props.event.id in eventsHorses)) {
            eventsHorses[props.event.id] = {}
        }
        let horsesData = reactive(eventsHorses[props.event.id])

        return {
            file,
            data,
            horsesData,
            classToName,
            selectedClass
        }
    },
    mounted () {
        // Activate bootstrap tooltips
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new Tooltip(tooltipTriggerEl)
        })
    },
    computed: {
        getFilteredSections() {
            const section_ids = Object.keys(this.horsesData)
            // return section_ids
            let filtered_sections = section_ids.filter((section_id) => this.horsesData[section_id]['horses'].length > 0)
            if (this.selectedClass != "null") {
                return filtered_sections.filter((section_id) => this.selectedClass == this.classToName[this.horsesData[section_id].class])
            } else {
                return filtered_sections
            }
        },

        availableRidingClasses() {
            const section_data = Object.values(this.horsesData)
            // return section_ids
            return [...new Set(section_data.map((section_data) => this.classToName[section_data.class]))]
        }
    },
    methods: {

        handleHorsesFileUpload() {
            for (let section_id in this.horsesData) {
                this.horsesData[section_id].horses = []
            }
            try {
                var files = document.getElementById("horsesFile").files
                this.parseFile(files[0], this.horsesDataToJson)
            } catch(err) {
                this.$notify({
                    title: 'Error',
                    text: `Error uploading riders: ${err}`,
                    type:'error'
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

        horsesDataToJson(data) {
            const classRegex = /Class\s\d{1,2}[AB]?/i;
            const sectionRegex = /Section [A-Z]/i;
            let headers = null
            for (let row of data) {
                // First row is the headers
                if (headers == null) {
                    headers = row
                    continue
                }
                let horse = { 'name': row[0], 'provider': row[1], 'takesHeight':true, 'takesWeight':true }
                for (let i = 2; i < row.length; i++) {
                    if (row[i]) {
                        let currClass = classRegex.exec(headers[i])
                        let match = sectionRegex.exec(headers[i])
                        let currSection = match !== null ? match[0].toUpperCase() : 'SECTION A'
                        if (currClass === null) {
                            continue
                        }
                        currClass = currClass[0].toUpperCase()
                        let section_id =  `${currClass} ${currSection}`
                        if (!(section_id in this.horsesData)) {
                            this.horsesData[section_id] = {}
                        }
                        this.horsesData[section_id].section = currSection
                        this.horsesData[section_id].class = currClass
                        this.horsesData[section_id].horses = this.horsesData[section_id].horses ? this.horsesData[section_id].horses : []
                        for (let j = 0; j < row[i]; j++) {
                            this.horsesData[section_id].horses.push(horse)
                        }
                    }
                }
            }

            const totalHorses = Object.values(this.horsesData).reduce((total, sectionData) => total + sectionData.horses.length, 0);

            if (totalHorses == 0) {
                this.$notify({
                    title: 'Error',
                    text: `Error loading horses`,
                    type: 'error'
                });
            } else {
                this.$notify({
                    title: 'Success',
                    text: `Horses uploaded succesfully`,
                    type: 'success'
                });
            }
        }

    }
}
</script>
  
<style scoped>
#collapseHorses,
#collapseRiders,
#collapseClasses {
    display: flex;
}

.collapse:not(.show) {
    display: none !important;
}

.icon {
    height:15px;
    width:15px;
}
</style>