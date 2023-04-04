<template>
        <div class="d-flex flex-column flex-grow-1 m-3 align-items-center justify-content-center">
            <div class="mb-3 d-flex w-50 justify-content-center align-items-center">
                <input class="form-control fs-5" type="file" id="horsesFile" accept=".csv">
                <button type="button" class="btn btn-primary fs-5" @click="handleHorsesFileUpload">Submit</button>
                <button type="button" class="btn btn-info ms-5 w-50 fs-5">Add Horse</button>
            </div>
            <div class="mb-3 d-flex w-75 flex-column justify-content-start">
                    <table class="table table-striped w-90 border border-primary"
                        v-for="section_id in getFilteredSections()" :key="section_id">
                        <thead class="table-dark">
                            <tr>
                                <th scope="col" colspan="2" class="fs-3">
                                    {{ classToName[horsesData[section_id].class] }} - {{ horsesData[section_id].section }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="horse in horsesData[section_id].horses" :key="horse.name">
                                <td class="fs-4">{{ horse.name }}</td>
                                <td class="fs-4">{{ horse.provider }}</td>
                            </tr>
                        </tbody>
                    </table>
            </div>
        </div>
</template>
  
<script>
import Papa from 'papaparse';
import { reactive } from 'vue'
import { useStore } from 'vuex'


export default {
    setup() {
        const store = useStore()
        let file = null
        let data = null
        let horsesData = reactive(store.state.eventHorses)
        let classToName = store.state.classToName
        return {
            file,
            data,
            horsesData,
            classToName
        }
    },
    name: 'manageEventHorses',
    methods: {
        // Filter riding classes that have no horses yet
        getFilteredSections() {
            const section_ids = Object.keys(this.horsesData)
            return section_ids.filter((section_id) => this.horsesData[section_id].horses.length > 0)
        },

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
            const classRegex = /Class\s\d{1,2}[AB]?/
            const sectionRegex = /Section [A-Z]/
            let headers = null
            for (let row of data) {
                // First row is the headers
                if (headers == null) {
                    headers = row
                    continue
                }
                let horse = { 'name': row[1], 'provider': row[2] }
                for (let i = 3; i < row.length; i++) {
                    if (row[i]) {
                        let currClass = classRegex.exec(headers[i])
                        let match = sectionRegex.exec(headers[i])
                        let currSection = match !== null ? match[0] : 'Section A'
                        if (currClass === null) {
                            continue
                        }
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
</style>