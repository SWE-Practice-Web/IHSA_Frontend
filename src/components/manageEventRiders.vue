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
                                <th scope="col" colspan="2" data-bs-toggle="collapse"
                                    :data-bs-target="`#collapseR${riderClass.split(' ')[1]}`" aria-expanded="false"
                                    :aria-controls="`collapseR${riderClass.split(' ')[1]}`" role="button">
                                    {{ riderClass }}
                                </th>
                            </tr>
                        </thead>
                        <tbody class="collapse" :id="`collapseR${riderClass.split(' ')[1]}`">
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

export default {
    setup() {
        let file = null
        let data = null
        let ridersData = reactive(this.$eventRiders)
        let horsesData = reactive(this.$eventHorses)
        let classDraw = reactive({ 'Class 11': [], 'Class 12A': [], 'Class 12B': [], 'Class 13': [], 'Class 14': [], 'Class 15': [], 'Class 16': [], 'Class 17': [] })
        return {
            file,
            data,
            ridersData,
            horsesData,
            classDraw
        }
    },
    name: 'AddRiders',
    components: {
    },
    methods: {
        assignHorses() {
            
            const DEFAULTHORSE = { 'name': 'null', 'provider': 'null' }
            for (const className in this.ridersData) {
                this.classDraw[className] = []
                const riders = this.ridersData[className];
                const horses = this.horsesData[className];

                // Shuffle the riders and horses arrays using the Fisher-Yates algorithm
                const shuffledRiders = this.shuffleArray(riders)
                const shuffledHorses = this.shuffleArray(horses)

                // Assign horses to riders within the same class
                const numPairs = Math.min(shuffledRiders.length, shuffledHorses.length);
                for (let i = 0; i < numPairs; i++) {
                    this.classDraw[className].push({ 'rider': shuffledRiders[i], 'horse': shuffledHorses[i] })
                }

                // Assign default horse to riders without a horse if there are less horses than riders
                if (riders.length > horses.length) {
                    for (let i = horses.length; i < riders.length; i++) {
                        this.classDraw[className].push({ 'rider': shuffledRiders[i], 'horse': DEFAULTHORSE })
                    }
                }
            }
            console.log(this.classDraw)
        },


        shuffleArray(originalArray) {
            let array = [...originalArray]
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                const temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
            return array
        },

        randomizeReady() {
            const totalRiders = Object.values(this.ridersData).reduce((acc, riders) => acc + riders.length, 0);
            const totalHorses = Object.values(this.horsesData).reduce((acc, horses) => acc + horses.length, 0);
            return (totalRiders > 0 && totalHorses > 0)
        },

        getSortedClasses() {
            return Object.keys(this.ridersData).sort()
        },

        handleRidersFileUpload() {
            var files = document.getElementById("ridersFile").files
            this.parseFile(files[0], this.ridersDataToJson)
        },

        handleHorsesFileUpload() {
            var files = document.getElementById("horsesFile").files
            this.parseFile(files[0], this.horsesDataToJson)
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
                        let student = { 'id': row[0], 'name': row[1], 'school': row[4] }
                        this.ridersData[currClass].push(student)
                    }
                }
            }
            this.$eventRiders = this.ridersData
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