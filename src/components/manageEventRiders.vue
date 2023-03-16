<template>
        <div class="flex-grow-1 m-3">
            <label class="" for="ridersFile">Riders: </label>
            <div class="mb-3 d-flex">
                <input class="form-control" type="file" id="ridersFile" accept=".csv">
                <button type="button" class="btn btn-primary" @click="handleRidersFileUpload">Submit</button>
            </div>
            <div class="mb-3 d-flex flex-column justify-content-start">
                <div class="d-flex flex-column align-items-center">
                    <table class="table table-striped w-90 border border-primary"
                        v-for="riderClass in getSortedClasses(ridersData)" :key="riderClass">
                        <thead class="table-dark">
                            <tr>
                                <th scope="col" colspan="2">
                                    {{ classToName[riderClass] }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="rider in ridersData[riderClass]" :key="rider.id">
                                <td>{{ rider.name }}</td>
                                <td>{{ rider.school }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <br>
            <br>
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
        getSortedClasses() {
            return Object.keys(this.ridersData).sort()
        },

        handleRidersFileUpload() {
            for (let riders in this.ridersData) {
                this.ridersData[riders] = []
            }
            try {
                var files = document.getElementById("ridersFile").files
                this.parseFile(files[0], this.ridersDataToJson)
            } catch(err) {
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
            const regex = /Class\s\d{1,2}[AB]?/
            let readData = false
            let currClass = null
            for (let row of data) {
                if (!readData) {
                    let match = regex.exec(row[1])
                    if (match !== null) {
                        readData = true
                        currClass = match[0]
                    }
                } else {
                    if (row[1] == "2. _________") {
                        readData = false
                    } else {
                        let student = { 'id': row[0], 'name': row[1], 'school': row[4], 'placing':null }
                        this.ridersData[currClass].push(student)
                    }
                }
            }
            const totalRiders = Object.values(this.ridersData).reduce((acc, riders) => acc + riders.length, 0);
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