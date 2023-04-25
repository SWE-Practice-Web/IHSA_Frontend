<template>
    <div>
        <div class="d-flex align-items-center justify-content-center">
            <div class="d-flex w-75 justify-content-between my-3">
                <button type="button" class="btn btn-primary fs-7" @click="randomize">
                    Randomize Classes
                </button>
                <select v-model="selectedClass" class="form-select w-25" aria-label="Default select example">
                    <option value="null" selected>Select a class</option>
                    <option v-for="ridingClass in availableRidingClasses" :key="ridingClass"><a class="dropdown-item"
                            href="#">{{ ridingClass }}</a></option>
                </select>
            </div>
        </div>
        <div class="m-1 d-flex flex-column justify-content-center align-items-center">
            <table class="table table-striped w-75 border border-primary" v-for="section_id in getFilteredClasses"
                :key="section_id">
                <thead class="table-dark">
                    <tr>

                        <th scope="col" colspan="7">
                            {{ classDraw[section_id].showClass }} - {{ classToName[classDraw[section_id].class] }} - {{
                                classDraw[section_id].section }}
                            <a class="p-2" data-bs-toggle="tooltip" data-bs-placement="top"
                                title="This class does not have enough horses"
                                v-if="classDraw[section_id]['riders'].some(noHorseAssigned)">
                                <font-awesome-icon style="color: yellow" class="icon"
                                    icon="fa-solid fa-triangle-exclamation" />
                            </a>
                        </th>
                    </tr>
                    <tr>
                        <th scope="col" class="bg-white text-dark fs-8">Placing</th>
                        <th scope="col" class="bg-white text-dark fs-8">Order</th>
                        <th scope="col" class="bg-white text-dark fs-8">Rider id</th>
                        <th scope="col" class="bg-white text-dark fs-8">Rider name</th>
                        <th scope="col" class="bg-white text-dark fs-8">Rider school</th>
                        <th scope="col" class="bg-white text-dark fs-8">Horse name</th>
                        <th scope="col" class="bg-white text-dark fs-8">Horse Provider</th>
                    </tr>
                </thead>
                <tbody>

                    <tr v-for="data in classDraw[section_id]['riders']" :key="data.rider.id">
                        <td><input type="number" v-model="data.rider.placing" min="0" class="w-25 text-center"
                                @input="this.notSavedInfo = true"></td>
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
import { Tooltip } from 'bootstrap'

export default {
    name: 'manageEventClasses',
    props: ['event'],
    setup(props) {
        const store = useStore()
        const DEFAULTHORSE = { 'name': 'N/A', 'provider': 'N/A' }
        let notSavedInfo = false;
        let myHover = ref(true)
        let file = null
        let data = null
        // Get ridersData
        let eventsRiders = reactive(store.state.eventsRiders)
        if (!(props.event.id in eventsRiders)) {
            eventsRiders[props.event.id] = {}
        }
        let ridersData = reactive(eventsRiders[props.event.id])
        // Get horsesData
        let eventsHorses = reactive(store.state.eventsHorses)
        if (!(props.event.id in eventsHorses)) {
            eventsHorses[props.event.id] = {}
        }
        let horsesData = reactive(eventsHorses[props.event.id])

        // Get classDraw data
        let eventsClasses = reactive(store.state.eventsClasses)
        if (!(props.event.id in eventsClasses)) {
            eventsClasses[props.event.id] = {}
        }
        let classDraw = reactive(eventsClasses[props.event.id])




        let classToName = store.state.classToName
        let selectedClass = ref("null")
        // Initialize classDraw sections if it is not initialized yet
        for (let section_id of Object.keys(ridersData)) {
            if (section_id in classDraw) {
                continue
            }
            classDraw[section_id] = { 'showClass': '', 'class': '', 'section': '', 'riders': [] }
        }

        return {
            file,
            data,
            ridersData,
            horsesData,
            classDraw,
            classToName,
            myHover,
            DEFAULTHORSE,
            store,
            selectedClass,
            notSavedInfo,
            Tooltip
        }
    },
    beforeUnmount() {
        if (this.notSavedInfo) {
            this.postPlacings()
        }
    },
    computed: {
        getFilteredClasses() {
            const section_ids = Object.keys(this.classDraw)
            // return section_ids
            let filtered_sections = section_ids.filter((section_id) => this.classDraw[section_id]['riders'].length > 0)
            if (this.selectedClass != "null") {
                return filtered_sections.filter((section_id) => this.selectedClass == this.classToName[this.classDraw[section_id].class])
            } else {
                return filtered_sections
            }
        },

        availableRidingClasses() {
            const section_data = Object.values(this.classDraw)
            // return section_ids
            return [...new Set(section_data.map((section_data) => this.classToName[section_data.class]))]
        }
    },
    methods: {
        activeTooltips() {
            // Activate bootstrap tooltips
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
            tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new Tooltip(tooltipTriggerEl)
            })
        },


        noHorseAssigned(draw) {
            return draw.horse.name == this.DEFAULTHORSE.name && draw.horse.provider == this.DEFAULTHORSE.provider;
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

        randomize() {
            if (!(this.randomizeReady())) {
                return
            }
            this.assignHorses()
            this.activeTooltips()

        },


        assignHorses() {
            for (const section_id of Object.keys(this.ridersData)) {
                let order = 1;
                this.classDraw[section_id].riders = []
                this.classDraw[section_id]['showClass'] = this.ridersData[section_id].showClass
                this.classDraw[section_id]['class'] = this.ridersData[section_id].class
                this.classDraw[section_id]['section'] = this.ridersData[section_id].section
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
                const filterFunc1 = (horse) => { return horse.takesHeight && horse.takesWeight }
                [shuffledHorses, order] = this.matchRiders(order, section_id, ridersHeightAndWeight, shuffledHorses, filterFunc1)

                // Match riders in ridersHeightAndWeight to horses
                const filterFunc2 = (horse) => { return horse.takesHeight }
                [shuffledHorses, order] = this.matchRiders(order, section_id, ridersHeight, shuffledHorses, filterFunc2)

                // Match riders in ridersHeightAndWeight to horses
                const filterFunc3 = (horse) => { return horse.takesWeight }
                [shuffledHorses, order] = this.matchRiders(order, section_id, ridersWeight, shuffledHorses, filterFunc3)

                // Match riders in ridersHeightAndWeight to horses
                const filterFunc4 = (_horse) => { return true }
                [shuffledHorses, order] = this.matchRiders(order, section_id, ridersRegular, shuffledHorses, filterFunc4)
            }

            this.postEventClasses()
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


        postEventClasses() {
            const riders = this.classDraw
            var ret = []
            var ret_i = 0

            for (let i in riders) {
                ret.push({
                    showClass: riders[i].showClass,
                    class: riders[i].class,
                    section: riders[i].section,
                    pairs: []
                })

                for (let pair of riders[i].riders) {
                    ret[ret_i].pairs.push({
                        riderId: pair.rider.id,
                        riderPlacing: pair.rider.placing,
                        order: pair.rider.order,
                        horseName: pair.horse.name,
                        horseProvider: pair.horse.provider
                    })
                }

                ret_i += 1
            }

            this.$axios.post(`/event/${this.event.id}/BatchAddEventOrder`, ret)
                .then(() => {
                    this.$notify({
                        title: 'Success updating class draw',
                        type: 'success'
                    });
                }).catch((err) => {
                    this.$notify({
                        title: 'Error',
                        text: `Error updating class draw: ${err}`,
                        type: 'error'
                    });
                })
            // fs.writeFileSync('./classDraw-2.json', JSON.stringify(ret, null, 2), 'utf8')
        },


        postPlacings() {
            console.log("Posting placings")
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