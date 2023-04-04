<template>
    <div class="d-flex flex-column flex-grow-1 m-3 align-items-center justify-content-center">
        <label class="" for="ridersFile">Riders: </label>
        <div class="mb-3 d-flex w-75 align-items-center justify-content-center">
            <input class="form-control" type="file" id="ridersFile" accept=".csv">
            <button type="button" class="btn btn-primary" @click="handleRidersFileUpload">Submit</button>
        </div>
        <div class="mb-3 d-flex w-75 flex-column justify-content-start">
            <table class="table table-striped border border-primary" v-for="section_id in getFilteredSections()" :key="section_id">
                <thead class="table-dark">
                    <tr>
                        <th scope="col" colspan="2">
                            {{ ridersData[section_id].showClass }} - {{ classToName[ridersData[section_id].class] }} - {{ ridersData[section_id].section }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="rider in ridersData[section_id].riders" :key="rider.id">
                        <td>{{ rider.name }}</td>
                        <td>{{ rider.school }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <br>
        <br>
    </div>
</template>
  
<script>
import Papa from 'papaparse';
import { useStore } from 'vuex'
import {reactive} from 'vue'

export default {
    setup() {
        const store = useStore()
        let file = null
        let data = null
        let ridersData = reactive(store.state.eventRiders)
        let classToName = store.state.classToName
        return {
            file,
            data,
            ridersData,
            classToName
        }
    },
    name: 'manageEventRiders',
    components: {
    },
    methods: {
        // Filter riding classes that have no riders yet
        getFilteredSections() {
            const section_ids = Object.keys(this.ridersData)
            return section_ids.filter((section_id) => this.ridersData[section_id].riders.length > 0)
        },


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
            const classRegex = /Class\s\d{1,2}[AB]?/
            const sectionRegex = /Section [A-Z]/
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
                        currClass = classMatch[0]
                        currSection = sectionMatch !== null ? sectionMatch[0] : 'Section A'
                        showClass = row[0]
                        section_id = `${currClass} ${currSection}`
                        this.ridersData[section_id] = {'showClass':showClass, 'class': currClass, 'section': currSection, 'riders': []}
                    }
                } else {
                    if (row[0] == "1. _________") {
                        readData = false
                    } else {
                        let student = { 'id': row[0], 'name': row[1], 'school': row[4], 'placing': null }
                        this.ridersData[section_id].riders.push(student)
                    }
                }
            }
            console.log(this.ridersData)
            
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
        },

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
</style>