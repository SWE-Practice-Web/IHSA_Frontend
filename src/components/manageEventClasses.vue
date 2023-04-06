<template>
    <div>
        <button type="button" class="btn btn-primary w-50 m-3" @click="assignHorses">Randomize Classes</button>
        <div class="m-3 d-flex flex-column justify-content-center align-items-center">
            <table class="table table-striped w-75 border border-primary" v-for="section_id in getFilteredClasses()"
                :key="section_id">
                <thead class="table-dark">
                    <tr>
                        <th scope="col" colspan="7">
                            {{ classDraw[section_id].showClass }} - {{ classToName[classDraw[section_id].class] }} - {{
                                classDraw[section_id].section }}
                            <font-awesome-icon class="ps-3 icon" v-if="classWarning[section_id]" style="color: yellow"
                                icon="fa-solid fa-triangle-exclamation" title="This class does not have enough horses" />
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
                    <tr v-for="data in classDraw[section_id]['riders']" :key="data.rider.id">
                        <td>{{ data.rider.placing ? data.rider.placing : "-" }}</td>
                        <td>{{ data.rider.order }}</td>
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
</template>
  
<script>
import { ref, reactive } from 'vue'
import { useStore } from 'vuex'

export default {
    setup() {
        const store = useStore()
        const DEFAULTHORSE = { 'name': 'N/A', 'provider': 'N/A' }
        let myHover = ref(true)
        let file = null
        let data = null
        let ridersData = reactive(store.state.eventRiders)
        let horsesData = reactive(store.state.eventHorses)
        let classDraw = reactive(store.state.eventClasses)
        let classToName = store.state.classToName
        let classWarning = {}

        // Initialize classDraw sections
        for (let section_id of Object.keys(ridersData)) {
            classDraw[section_id] = { 'showClass': '', 'class': '', 'section': '', 'riders': [] }
        }

        return {
            file,
            data,
            ridersData,
            horsesData,
            classDraw,
            classToName,
            classWarning,
            myHover,
            DEFAULTHORSE
        }
    },
    name: 'AddRiders',
    methods: {
        handleTooltip(hover) {
            this.myHover = hover
        },


        matchRiders(order, section_id, riders, horses, filterFunc) {
            // Match riders in ridersHeightAndWeight to horses
            for (let rider of riders) {
                rider.order = order++
                let horseIndex;
                let matched = false
                for (let i = 0; i < horses.length; i++) {
                    if (filterFunc(horses[i])) {
                        this.classDraw[section_id]['riders'].push({ 'rider': rider, 'horse': horses[i] })
                        matched = true
                        horseIndex = i
                        break
                    }
                }
                if (matched) {
                    // If a horse was matched with the rider we remove it from the horses array to not reuse it later
                    horses.splice(horseIndex, 1)
                } else {
                    // If no horse was matched just assign default horse to the rider
                    this.classDraw[section_id]['riders'].push({ 'rider': rider, 'horse': this.DEFAULTHORSE })
                }
            }
            return [horses, order]
        },


        assignHorses() {
            if (!(this.randomizeReady())) {
                return
            }

            for (const section_id of Object.keys(this.ridersData)) {
                let order = 0;
                this.classDraw[section_id].riders = []
                this.classDraw[section_id]['showClass'] = this.ridersData[section_id].showClass
                this.classDraw[section_id]['class'] = this.ridersData[section_id].class
                this.classDraw[section_id]['section'] = this.ridersData[section_id].section
                this.classWarning[section_id] = false
                const riders = this.ridersData[section_id].riders;
                const horses = section_id in this.horsesData ? this.horsesData[section_id].horses : []

                // Shuffle the riders and horses arrays using the Fisher-Yates algorithm
                const shuffledRiders = this.shuffleArray(riders)
                let shuffledHorses = this.shuffleArray(horses)

                // Split riders into 4 groups: RiderIsHeightandWeight, RiderIsHeight, RiderIsWeight, RidersRegular
                const ridersHeightAndWeight = riders.filter((rider) => (rider.isHeight && rider.isWeight))
                const ridersHeight = shuffledRiders.filter((rider) => (rider.isHeight && !(rider.isWeight)))
                const ridersWeight = shuffledRiders.filter((rider) => (!(rider.isHeight) && rider.isWeight))
                const ridersRegular = shuffledRiders.filter((rider) => (!(rider.isHeight) && !(rider.isWeight)))


                // Match riders in ridersHeightAndWeight to horses
                const filterFunc1 = (horse) => {return horse.takesHeight && horse.takesWeight}
                [shuffledHorses, order] = this.matchRiders(order, section_id, ridersHeightAndWeight, shuffledHorses, filterFunc1)

                // Match riders in ridersHeightAndWeight to horses
                const filterFunc2 = (horse) => {return horse.takesHeight}
                [shuffledHorses, order] = this.matchRiders(order, section_id, ridersHeight, shuffledHorses, filterFunc2)

                // Match riders in ridersHeightAndWeight to horses
                const filterFunc3 = (horse) => {return horse.takesWeight}
                [shuffledHorses, order] = this.matchRiders(order, section_id, ridersWeight, shuffledHorses, filterFunc3)

                // Match riders in ridersHeightAndWeight to horses
                const filterFunc4 = (_horse) => {return true}
                [shuffledHorses, order] = this.matchRiders(order, section_id, ridersRegular, shuffledHorses, filterFunc4)
            }
        },


        shuffleArray(originalArray) {
            let array = [...originalArray]
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]]
            }

            for (let i = 0; i < array.length - 1; i++) {
                if (array[i] === array[i + 1]) {
                    let j = i + 1;
                    while (j < array.length - 1 && array[j] === array[i]) {
                        j++;
                    }
                    [array[i + 1], array[j]] = [array[j], array[i + 1]]
                }
            }
            return array
        },

        randomizeReady() {
            const totalRiders = Object.values(this.ridersData).reduce((total, sectionData) => total + sectionData.riders.length, 0);
            const totalHorses = Object.values(this.horsesData).reduce((total, sectionData) => total + sectionData.horses.length, 0);
            if (totalRiders <= 0) {
                this.$notify({
                    title: 'Warn',
                    text: "You need to add riders to the event first",
                    type: 'warn'
                });
            }
            if (totalHorses <= 0) {
                this.$notify({
                    title: 'Warn',
                    text: "You need to add horses to the event first",
                    type: 'warn'
                });
            }
            return (totalRiders > 0 && totalHorses > 0)
        },

        // Filter riding classes that have no horses yet
        getFilteredClasses() {
            // let sortedClasses = this.getSortedClasses()
            // return sortedClasses.filter((ridingClass) => this.classDraw[ridingClass].length > 0)

            const section_ids = Object.keys(this.ridersData)
            // return section_ids
            return section_ids.filter((section_id) => this.classDraw[section_id]['riders'].length > 0)
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

/* normal state */
.icon {
    transition: transform 0.1s ease-in-out;
    /* optional: add a smooth transition */
}

/* hover state */
.icon:hover {
    transform: scale(1.3);
}
</style>