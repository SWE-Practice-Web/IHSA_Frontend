<template>
    <div class="backgroundColor">
        <div class="m-3 d-flex flex-column justify-content-center align-items-center">
            <div class="w-75 d-flex justify-content-between mt-3">
                <div>
                    <select class="form-select form-select-lg fs-6" v-model="selectedEvent">
                        <option v-for="event in events" :value="event" :key="event.id" class="fs-3">{{ event.location }}
                        </option>
                    </select>
                </div>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#">Name</a></li>
                    <li><a class="dropdown-item" href="#">Age</a></li>
                    <li><a class="dropdown-item" href="#">Height</a></li>
                    <li><a class="dropdown-item" href="#">Weight</a></li>
                    <li><a class="dropdown-item" href="#">Color</a></li>
                </ul>
                <select v-model="selectedClass" class="form-select w-25 fs-6" aria-label="Default select example">
                    <option value="null" selected>Select a class</option>
                    <option v-for="ridingClass in availableRidingClasses" :key="ridingClass"><a class="dropdown-item"
                            href="#">{{ ridingClass }}</a></option>
                </select>
            </div>
        </div>
        <div v-if="selectedEvent" class="d-flex justify-content-center m-3">
            <div class="fs-5 w-75 text-start">Riding patterns <a class="link-primary fs-5" :href="selectedEvent.ridingPattern" target="_blank">here</a></div>
        </div>

        <div class="m-3 d-flex flex-column justify-content-center align-items-center">
            <table class="table table-striped w-75 border border-primary" v-for="section in getFilteredClasses"
                :key="section.showClass">
                <thead class="table-dark">
                    <tr>
                        <th scope="col" colspan="7">
                            {{ section.showClass }} - {{ classToName[section.class] }} - {{
                                section.section }}
                            <a class="p-2" data-bs-toggle="tooltip" data-bs-placement="top"
                                title="This class does not have enough horses" v-if="section.riders.some(noHorseAssigned)">
                                <font-awesome-icon style="color: yellow" class="icon"
                                    icon="fa-solid fa-triangle-exclamation" />
                            </a>
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
                    <tr v-for="data in section.riders" :key="data.rider.id">
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

    <!-- Loading Modal -->
    <div ref="loader" class="modal" id="myModal" tabindex="-1" aria-labelledby="exampleModalLabel" data-bs-backdrop="static"
        data-bs-keyboard="false" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered d-flex justify-content-center">
            <div class="modal-content">
                <div class="modal-title fs-4">Loading...</div>
                <div class="modal-body">
                    <div class="spinner-border" style="width:8rem; height:8rem" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import eventData from '../../../public/classDrawNew.json'
import { useStore } from 'vuex'
import { ref, reactive } from 'vue'
import { Tooltip, Modal } from 'bootstrap'


export default {
    name: 'HomePage',
    setup() {
        const store = useStore()
        const DEFAULTHORSE = { 'name': 'N/A', 'provider': 'N/A' }
        let events = reactive([])
        let selectedEvent = ref(null)
        let eventsClasses = reactive(store.state.eventsClasses)
        let classToName = store.state.classToName
        let selectedClass = ref("null")
        return {
            events,
            classToName,
            selectedClass,
            selectedEvent,
            DEFAULTHORSE,
            eventsClasses,
            Modal,
            eventData
        }
    },
    async mounted() {
        this.loader = new Modal(this.$refs.loader, {})
        this.loader.show()
        const events = await this.getEvents()
            .then((res) => {
                return res.data
            })
            .catch(err => {
                this.$notify({
                    title: 'Error',
                    text: `Error loading events: ${err}`,
                    type: 'error'
                });
                return [this.eventData]
            })
        
        // Add events to events list
        this.events.push(...events)
        // Select latest event
        this.selectedEvent = this.sortedEvents[0]
        // Add event draws to store eventsClasses
        for (let id of Object.keys(this.events)) {
            this.formatClassDraw(this.events[id])
        }
        this.loader.hide()
        this.activeTooltips()
    },

    computed: {
        sortedEvents() {
            return this.events.slice().sort((a, b) => new Date(b.eventTime) - new Date(a.eventTime))
        },

        getFilteredClasses() {
            if (!(this.selectedEvent)) { return [] }
            const sections = Object.values(this.selectedEvent.classDraw)
            // return section_ids
            let filtered_sections = sections.filter((section) => section.riders.length > 0)
            if (this.selectedClass != "null") {
                return filtered_sections.filter((section) => this.selectedClass == this.classToName[section.class])
            } else {
                return filtered_sections
            }
        },

        availableRidingClasses() {
            if (!(this.selectedEvent)) { return [] }
            const section_data = Object.values(this.selectedEvent.classDraw)
            // return section_ids
            return [...new Set(section_data.map((section_data) => this.classToName[section_data.class]))]
        }
    },
    methods: {

        async getEvents() {
            return this.$axios.get("/Event")
        },

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

        formatClassDraw(selectedEvent) {
            selectedEvent.classDraw = {}
            for (let section of selectedEvent.eventOrder) {
                let riders = section.pairs.map((pair) => {
                    let rider = {
                        "id": pair.riderId,
                        "name": pair.riderName,
                        "school": pair.riderSchool,
                        "placing": pair.riderPlacing,
                        "isHeight": null,
                        "isWeight": null,
                        "order": pair.order
                    }
                    let horse = {
                        "name": pair.horseName,
                        "provider": pair.horseProvider,
                        "takesHeight": null,
                        "takesWeight": null
                    }
                    return { 'rider': rider, "horse": horse }
                })
                selectedEvent.classDraw[`${section.class} ${section.section}`] = {
                    'showClass': section.showClass,
                    'class': section.class,
                    'section': section.section,
                    'riders': riders
                }
            }

            this.eventsClasses[selectedEvent.id] = selectedEvent.classDraw
        }
    }
}

</script>

<style>
.backgroundColor {
    background-color: rgb(234, 242, 255);
}
</style>
