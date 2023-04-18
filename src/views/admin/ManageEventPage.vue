<template>
    <div class="container1 d-flex flex-column align-items-center">
        <div class="pt-3 w-75 d-flex flex-row justify-content-between algin-items-between">
            <div>
                <h2 class="fs-1 fw-bolder">Manage Events</h2>
            </div>
            <div>
                <button class="btn btn-lg fs-5 bg-success" @click="createNew">Create New Event</button>
            </div>
        </div>
        <div class="pt-3 w-75 d-flex flex-row justify-content-between algin-items-between">
            <div>
                <select class="form-select form-select-lg fs-3" v-model="eventInfo">
                    <option v-for="event in events" :value="event" :key="event.id" class="fs-3">{{ event.location }}</option>
                </select>
            </div>
            <div>
                <select class="form-select form-select-lg fs-3" v-model="aspectSelected">
                    <option class="fs-3" value="info">Information</option>
                    <option class="fs-3" value="riders">Riders</option>
                    <option class="fs-3" value="horses">Horses</option>
                    <option class="fs-3" value="classes">Classes</option>
                </select>
            </div>
        </div>
        <div class="w-100">
            <component :is="views[aspectSelected]"/>
        </div>
    </div>
</template>

<script>
import { reactive, ref } from 'vue'
import {useStore} from 'vuex'
import eventInfoTable from '../../components/manageEventInfo.vue'
import manageEventRiders from '../../components/manageEventRiders.vue'
import manageEventHorses from '../../components/manageEventHorses.vue'
import manageEventClasses from '../../components/manageEventClasses.vue'
import eventData from "../../../public/classDrawNew.json"

export default {
    name: 'ManageEventPage',
    setup() {
        const store = useStore()
        let events = reactive([])
        let eventInfo = reactive(store.state.eventInfo)
        let aspectSelected = ref("info")

        return {
            events,
            eventInfo,
            aspectSelected,
            views: {
                'info':'eventInfoTable',
                'riders':'manageEventRiders',
                'horses':'manageEventHorses',
                'classes':'manageEventClasses'
            },
            eventData
        }
    },
    created() {
        const eventsData = this.getEvents()
        for (let evt of eventsData) {
            this.events.push(evt)
        }

        Object.assign(this.eventInfo, this.events[0])
    },
    methods: {
        getEvents() {
            return [eventData]
        },

        createNew: function() {
            let createModal = document.getElementById('createNewModal')
            createModal.style.display = 'block'
        }
    },
    components: {
        eventInfoTable,
        manageEventRiders,
        manageEventHorses,
        manageEventClasses
    }
}
</script>

<style scoped>
.container1 {
    background-color: rgb(234, 242, 255);
    min-height: 93vh;
}
</style>>