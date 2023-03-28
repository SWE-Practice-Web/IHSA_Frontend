<template>
    <div class="container bg-info">
        <div class="row pt-3">
            <div class="col">
            </div>
            <div class="col">
                <button class="btn btn-lg fs-5">Create New Event</button>
            </div>
        </div>
        <div class="row pt-3">
            <div class="col">
                <select class="form-select form-select-lg fs-3" v-model="eventSelected">
                    <option v-for="event in events" :key="event.id" class="fs-3">{{ event.name }}</option>
                </select>
            </div>
            <div class="col">
                <select class="form-select form-select-lg fs-3" v-model="aspectSelected">
                    <option class="fs-3" value="info">Event Information</option>
                    <option class="fs-3" value="riders">Riders</option>
                    <option class="fs-3" value="horses">Horses</option>
                    <option class="fs-3" value="classes">Classes</option>
                </select>
            </div>
        </div>
    </div>
    <eventInfoTable :eventSelected="eventSelected" :aspectSelected="aspectSelected" />
</template>

<script>
import { reactive } from 'vue'
import eventInfoTable from '../../components/eventInfoTable.vue'

export default {
    name: 'ManageEventPage',
    setup() {
        let events = reactive([
            { id: 1, name: 'Black Hawk College Western Show', admins: ['Admin1', 'Admin2'], date: '03/26/2023', description: 'Saturday show at Black Hawk College'},
            { id: 2, name: 'Iowa State Western Show', admins: ['Admin3', 'Admin4'], date: '02/14/2023', description: 'Annual Iowa State Western show'},
            { id: 3, name: 'Northwest MO State Western Show', admins: ['Admin5', 'Admin6'], date: '01/19/2023', description: 'Saturday afternoon show in Maryville, MO'},
        ])
        let eventSelected
        let aspectSelected 

        return {
            events,
            eventSelected,
            aspectSelected,
        }
    },
    methods: {

    },
    components: {
        eventInfoTable,
    }
}
</script>

<style>

</style>