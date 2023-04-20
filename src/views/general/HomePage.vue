<template>
    <div class="backgroundColor">
        <div class="m-3 d-flex flex-column justify-content-center align-items-center">
            <div class="w-75 d-flex justify-content-between mt-3">
                <div>
                <select class="form-select form-select-lg fs-6" v-model="eventInfo">
                    <option v-for="event in events" :value="event" :key="event.id" class="fs-3">{{ event.location }}</option>
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
</template>

<script>
import eventInfo from '../../../public/classDrawNew.json'
import { useStore } from 'vuex'
import { ref, reactive } from 'vue'
import { Tooltip } from 'bootstrap'

export default {
    name: 'HomePage',
    setup() {
        const store = useStore()
        const DEFAULTHORSE = { 'name': 'N/A', 'provider': 'N/A' }
        let events = [eventInfo]
        let classToName = store.state.classToName
        eventInfo.classDraw = reactive({})
        let selectedClass = ref("null")
        return {
            events,
            eventInfo,
            classToName,
            selectedClass,
            DEFAULTHORSE
        }
    },
    created() {
        this.initClassDraw()
    },
    mounted() {
        this.activeTooltips()
    },

    computed: {
        getFilteredClasses() {
            const sections = Object.values(this.eventInfo.classDraw)
            // return section_ids
            let filtered_sections = sections.filter((section) => section.riders.length > 0)
            if (this.selectedClass != "null") {
                return filtered_sections.filter((section) => this.selectedClass == this.classToName[section.class])
            } else {
                return filtered_sections
            }
        },

        availableRidingClasses() {
            const section_data = Object.values(this.eventInfo.classDraw)
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

        initClassDraw() {
            for (let section of eventInfo.eventOrder) {
                let riders = section.pairs.map((pair) => {
                    let rider = {
                        "id": pair.riderId,
                        "name": pair.riderName,
                        "school": pair.riderSchool,
                        "placing": pair.placing,
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

                this.eventInfo.classDraw[`${section.class} ${section.section}`] = {
                    'showClass': section.showClass,
                    'class': section.class,
                    'section': section.section,
                    'riders': riders
                }
            }
        }
    }
}

</script>

<style>
.backgroundColor {
  background-color: rgb(234, 242, 255);
}
</style>
