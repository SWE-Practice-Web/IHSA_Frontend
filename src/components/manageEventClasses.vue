<template>
    <div>
        <button type="button" class="btn btn-primary w-50 m-3" @click="assignHorses">Randomize Classes</button>
        <div class="m-3 d-flex flex-column justify-content-center align-items-center">
            <div class="d-flex flex-column align-items-center justify-content-center w-100">
                <table class="table table-striped w-90 border border-primary"
                    v-for="riderClass in getSortedClasses(classDraw)" :key="riderClass">
                    <thead class="table-dark">
                        <tr>
                            <th scope="col" colspan="7">
                                {{ classToName[riderClass] }}
                            </th>
                        </tr>
                        <tr>
                            <th scope="col" class="bg-white text-dark">Placing</th>
                            <th scope="col" class="bg-white text-dark">Order</th>
                            <th scope="col" class="bg-white text-dark">Rider id</th>
                            <th scope="col" class="bg-white text-dark">Rider name</th>
                            <th scope="col" class="bg-white text-dark">Rider school</th>
                            <th scope="col" class="bg-white text-dark">Horse name</th>
                            <th scope="col" class="bg-white text-dark">Horse Provider</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="data in classDraw[riderClass]" :key="data.rider.id">
                            <td>{{ data.rider.placing ? data.rider.placing : "-"}}</td>
                            <td>{{ data.rider.order}}</td>
                            <td>{{ data.rider.id }}</td>
                            <td>{{ data.rider.name }}</td>
                            <td>{{ data.rider.school }}</td>
                            <td>{{ data.horse.name }}</td>
                            <td>{{ data.horse.provider }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
  
<script>
import { reactive } from 'vue'
import {useStore} from 'vuex'

export default {
    setup() {
        const store = useStore()
        let file = null
        let data = null
        let ridersData = reactive(store.state.eventRiders)
        let horsesData = reactive(store.state.eventHorses)
        let classDraw = reactive(store.state.eventClasses)
        let classToName = store.state.classToName

        return {
            file,
            data,
            ridersData,
            horsesData,
            classDraw,
            classToName
        }
    },
    name: 'AddRiders',
    components: {
    },
    methods: {
        assignHorses() {
            if (!(this.randomizeReady())) {
                return
            }
            
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
                    shuffledRiders[i].order = i
                    this.classDraw[className].push({ 'rider': shuffledRiders[i], 'horse': shuffledHorses[i] })
                }

                // Assign default horse to riders without a horse if there are less horses than riders
                if (riders.length > horses.length) {
                    this.$notify({
                        title: 'Warn',
                        text: `Class ${className} has less horses than riders. Some riders will not have a horse assigned to them.`,
                        type:'warn',
                        duration: 10000,
                    });
                    for (let i = horses.length; i < riders.length; i++) {
                        shuffledRiders[i].order = i
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
            if (totalRiders <= 0) {
                this.$notify({
                    title: 'Warn',
                    text: "You need to add riders to the event first",
                    type:'warn'
                });
            }
            if (totalHorses <= 0) {
                this.$notify({
                    title: 'Warn',
                    text: "You need to add horses to the event first",
                    type:'warn'
                });
            }
            return (totalRiders > 0 && totalHorses > 0)
        },

        getSortedClasses() {
            return Object.keys(this.ridersData).sort()
        },

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