<template>
        <div class="flex-grow-1 m-3">
            <label class="card-title" for="horsesFile">Horses: </label>
            <div class="mb-3 d-flex">
                <input class="form-control" type="file" id="horsesFile" accept=".csv">
                <button type="button" class="btn btn-primary" @click="handleHorsesFileUpload">Submit</button>
            </div>
            <div class="mb-3 d-flex flex-column justify-content-start">
                <div class="d-flex flex-column align-items-center">
                    <table class="table table-striped w-90 border border-primary"
                        v-for="horseClass in getSortedClasses(horsesData)" :key="horseClass">
                        <thead class="table-dark">
                            <tr>
                                <th scope="col" colspan="2">
                                    {{ classToName[horseClass] }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="horse in horsesData[horseClass]" :key="horse.name">
                                <td>{{ horse.name }}</td>
                                <td>{{ horse.provider }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
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
        getSortedClasses() {
            return Object.keys(this.horsesData).sort()
        },

        handleHorsesFileUpload() {
            for (let horses in this.horsesData) {
                this.horsesData[horses] = []
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
            const regex = /Class\s\d{1,2}[AB]?/
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
                        let currClass = regex.exec(headers[i])
                        for (let j = 0; j < row[i]; j++) {
                            this.horsesData[currClass].push(horse)
                        }
                    }
                }
            }
            const totalHorses = Object.values(this.horsesData).reduce((acc, horses) => acc + horses.length, 0);
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