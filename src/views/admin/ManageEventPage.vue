<template>
    <div class="container">
        <div class="row pt-3">
            <div class="col">
            </div>
            <div class="col">
                <button class="btn btn-lg fs-5 bg-success" data-bs-toggle="modal" data-bs-target="#createNewModal">Create New Event</button>
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
    <div class="modal bg-secondary" id="createNewModal">
        <div class="modal-xl modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="modal-title fs-3">New Event</div>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <eventInfoTable :eventSelected="{ id: -1, name: '', admins: [], date: '', ridingPattern: [], description: ''}" :admins="admins"/>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-lg btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-lg btn-primary" data-bs-dismiss="modal" @click="createEvent">Save changes</button>
                </div>
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
            { id: 1, name: 'Black Hawk College Western Show', admins: ['Bert Young'], date: '2023-04-06', ridingPattern: ['linkToPattern1.pdf', 'linkToPatter2.pdf'], description: 'Saturday show at Black Hawk College'},
            { id: 2, name: 'Iowa State Western Show', admins: ['Brenda Ghost'], date: '2023-04-05', ridingPattern: ['linkToPattern3.pdf', 'linkToPattern4.pdf'], description: 'Annual Iowa State Western show'},
            { id: 3, name: 'Northwest MO State Western Show', admins: ['Jackie Brown'], date: '2023-04-03', ridingPattern: ['linkToPattern5.pdf', 'linkToPatter6.pdf'], description: 'Saturday afternoon show in Maryville, MO'},
        ])
        let admins = ['Bert Young', 'Brenda Ghost', 'Jackie Brown']
        let eventSelected = ref(null)
        let aspectSelected = ref(null)

        return {
            events,
            admins,
            eventSelected,
            aspectSelected,
        }
    },
    methods: {
        // is called after save button is clicked when creating a new event, save to db?
        createEvent: function() {
            let createNewModal = document.getElementById('createNewModal')
            let inputs = createNewModal.querySelectorAll('input')
            let numAdmins = this.admins.length
            let eventName = inputs[0].value
            let eventAdmins = []
            for (let i = 1; i < numAdmins + 1; i++) {
                if (inputs[i].checked) {
                    eventAdmins.push(inputs[i].value)
                }
            }
            let eventDate = inputs[numAdmins+1].value
            let eventPatterns = inputs[numAdmins+2].value.split(',').map(word => word.trim())
            let eventDescription = inputs[numAdmins+3].value
            let newEvent = { id:888, name: eventName, admins: eventAdmins, date: eventDate, ridingPattern: eventPatterns, description: eventDescription}
            this.events.push(newEvent)
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