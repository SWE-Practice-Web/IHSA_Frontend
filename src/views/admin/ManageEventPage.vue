<template>
    <div class="container">
        <div class="row pt-3">
            <div class="col">
            </div>
            <div class="col">
                <button class="btn btn-lg fs-5 bg-success" @click="createNew">Create New Event</button>
            </div>
        </div>
        <div class="row pt-3">
            <div class="col">
                <select class="form-select form-select-lg fs-3" v-model="eventSelected">
                    <option v-for="event in events" :value="event" :key="event.id" class="fs-3">{{ event.name }}</option>
                </select>
            </div>
            <div class="col">
                <select class="form-select form-select-lg fs-3" v-model="aspectSelected">
                    <option class="fs-3" value="info">Information</option>
                    <option class="fs-3" value="riders">Riders</option>
                    <option class="fs-3" value="horses">Horses</option>
                    <option class="fs-3" value="classes">Classes</option>
                </select>
            </div>
        </div>
    </div>
    <eventInfoTable v-if="aspectSelected=='info'" :eventSelected="eventSelected" :admins="admins"/>
    <manageEventRiders v-if="aspectSelected=='riders'" />
    <manageEventHorses v-if="aspectSelected=='horses'" />
    <manageEventClasses v-if="aspectSelected=='classes'" />
    <div class="modal" id="createNewModal">
        <div class="modal-xl modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
                <eventInfoTable :eventSelected="{ id: null, name: null, date: null, description: null, riders: null}"/>
            </div>
        </div>
    </div>
</template>

<script>
import { reactive, ref } from 'vue'
import eventInfoTable from '../../components/eventInfoTable.vue'
import manageEventRiders from '../../components/manageEventRiders.vue'
import manageEventHorses from '../../components/manageEventHorses.vue'
import manageEventClasses from '../../components/manageEventClasses.vue'

export default {
    name: 'ManageEventPage',
    setup() {
        let events = reactive([
            { id: 1, name: 'Black Hawk College Western Show', date: '03/26/2023', description: 'Saturday show at Black Hawk College', riders: [{id: 123, name: 'BHShow Rider 1', university: 'Truman State', isHeight: false, isWeight: false}, {id: 553, name: 'BHShow Rider 2', university: 'UMKC', isHeight: false, isWeight: true}, {id: 122, name: 'BHShow Rider 3', university: 'Graceland U', isHeight: false, isWeight: false}]},
            { id: 2, name: 'Iowa State Western Show', date: '02/14/2023', description: 'Annual Iowa State Western show', riders: [{id: 653, name: 'Iowa State Show Rider 1', university: 'MWSU', isHeight: true, isWeight: true}, {id: 900, name: 'Iowa State Rider 2', university: 'UCM', isHeight: false, isWeight: true}, {id: 993, name: 'Iowa State Show Rider 3', university: 'Iowa State', isHeight: true, isWeight: false}]},
            { id: 3, name: 'Northwest MO State Western Show', date: '01/19/2023', description: 'Saturday afternoon show in Maryville, MO', riders: [{id: 123, name: 'NWShow Rider 1', university: 'BlackHawk', isHeight: true, isWeight: false}, {id: 234, name: 'NWShow Rider 2', university: 'NWMSU', isHeight: false, isWeight: false}, {id: 444, name: 'NWShow Rider 3', university: 'Iowa State', isHeight: true, isWeight: true}]},
        ])
        let eventSelected = ref(null)
        let aspectSelected = ref(null)

        return {
            events,
            eventSelected,
            aspectSelected,
        }
    },
    methods: {
        createNew: function() {
            let createModal = document.getElementById('createNewModal')
            createModal.style.display = 'block'
        }
    },
    components: {
        eventInfoTable,
        manageEventRiders,
        manageEventHorses,
        manageEventClasses,
    }
}
</script>

<style>

</style>