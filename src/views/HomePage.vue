<template class="homeContainer">
    <div class="m-3 d-flex flex-column justify-content-center align-items-center">
        <div class="w-75 d-flex justify-content-between mt-3">
            <button class="btn btn-secondary dropdown-toggle w-25" type="button" data-bs-toggle="dropdown" aria-expanded="false" disabled>
            Select Event
            </button>
            <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#">Name</a></li>
                <li><a class="dropdown-item" href="#">Age</a></li>
                <li><a class="dropdown-item" href="#">Height</a></li>
                <li><a class="dropdown-item" href="#">Weight</a></li>
                <li><a class="dropdown-item" href="#">Color</a></li>
            </ul>
            <select v-model="selectedClass" class="form-select w-25" aria-label="Default select example">
                <option value="null" selected>Select a class</option>
                <option v-for="ridingClass in availableRidingClasses" :key="ridingClass" ><a class="dropdown-item" href="#">{{ ridingClass }}</a></option>
            </select>
        </div>
    </div>

    <div class="m-3 d-flex flex-column justify-content-center align-items-center">
            <table class="table table-striped w-75 border border-primary" v-for="section_id in getFilteredClasses"
                :key="section_id">
                <thead class="table-dark">
                    <tr>
                        <th scope="col" colspan="7">
                            {{ classDraw[section_id].showClass }} - {{ classToName[classDraw[section_id].class] }} - {{
                                classDraw[section_id].section }}
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
</template>

<script>
import classDraw from '../../public/classDraw.json'
import { useStore } from 'vuex'
import {ref} from 'vue'

export default {
    name: 'HomePage',
    setup() {
        const store = useStore()
        let events = ["Sample Event"]
        let eventInfo = {"classDraw": classDraw}
        let classToName = store.state.classToName
        let selectedClass = ref("null")
        return {
            events,
            eventInfo,
            classToName,
            classDraw,
            selectedClass
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
    }
}

</script>

<style>
.homeContainer {
    height: 100%;
    width: 100%;
    background-color: lightcyan;
}
</style>
