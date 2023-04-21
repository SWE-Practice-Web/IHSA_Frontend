<template>
    <div class="container1 d-flex flex-column align-items-center">
        <div class="pt-3 w-75 d-flex flex-row justify-content-between algin-items-between">
            <div>
                <h2 class="fs-1 fw-bolder">Manage Events</h2>
            </div>
            <div>
                <button class="btn btn-lg fs-5 bg-primary" data-bs-toggle="modal" data-bs-target="#createModal"
                    @click="initEvent">
                    Create New Event
                </button>
            </div>
        </div>
        <div class="pt-3 w-75 d-flex flex-row justify-content-between algin-items-between">
            <div>
                <select class="form-select form-select-lg fs-3" v-model="selectedEvent">
                    <option v-for="event in sortedEvents" :value="event" :key="event.id" class="fs-3">{{ event.location }}
                    </option>
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
            <component :key="selectedEvent" :is="views[aspectSelected]" :event="selectedEvent" />
        </div>
    </div>



    <!-- Create event modal -->
    <div class="modal fade" id="createModal" tabindex="-1" aria-labelledby="createModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="createModalLabel">Create new event</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="container mt-3 p-4 bg-secondary rounded w-75">
                        <div class="col">
                            <div class="row">
                                <div class="input-group m-2">
                                    <span class="input-group-text fs-4">Name</span>
                                    <input type="text" class="form-control fs-4" v-model="newEvent.location">
                                </div>
                            </div>
                            <div class="row">
                                <div class="input-group m-2">
                                    <span class="input-group-text fs-4">Date</span>
                                    <input type="date" class="form-control fs-4" v-model="newEvent.eventTime">
                                </div>
                            </div>
                            <div class="row">
                                <div class="input-group m-2">
                                    <span class="input-group-text fs-4">Link to riding patterns</span>
                                    <input type="text" class="form-control fs-4" v-model="newEvent.ridingPattern">
                                </div>
                            </div>
                            <div class="row">
                                <div class="input-group m-2">
                                    <span class="input-group-text fs-4">Description</span>
                                    <input type="text" class="form-control fs-4" v-model="newEvent.description">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-danger btn-lg fs-6 d-flex align-items-center justify-content-center"
                        data-bs-dismiss="modal">Cancel</button>
                    <button class="btn btn-success btn-lg fs-6 d-flex align-items-center justify-content-center"
                        data-bs-dismiss="modal" @click="createEvent">Save Changes</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { reactive, ref } from 'vue'
import eventInfoTable from '../../components/manageEventInfo.vue'
import manageEventRiders from '../../components/manageEventRiders.vue'
import manageEventHorses from '../../components/manageEventHorses.vue'
import manageEventClasses from '../../components/manageEventClasses.vue'
import eventData from "../../../public/events.json"
const EMPTY_EVENT = {
    location: '',
    eventOrder: [],
    eventTime: '',
    ridingPattern: '',
    description: '',
    zone: 0
}

export default {
    name: 'ManageEventPage',
    setup() {
        let events = reactive([])
        let selectedEvent = ref(null)
        let aspectSelected = ref("info")
        let newEvent = ref(EMPTY_EVENT)
        return {
            aspectSelected,
            views: {
                'info': 'eventInfoTable',
                'riders': 'manageEventRiders',
                'horses': 'manageEventHorses',
                'classes': 'manageEventClasses'
            },
            events,
            selectedEvent,
            newEvent,
            eventData,
            EMPTY_EVENT
        }
    },
    async created() {
        const eventsData = await this.getEvents()
        console.log(eventsData)
        this.events.push(...eventsData)
        this.selectedEvent = eventsData[0]
    },
    computed: {
        sortedEvents() {
            return this.events.slice().sort((a,b) => new Date(b.eventTime) - new Date(a.eventTime))
        }
    },
    methods: {
        getEvents() {
            return this.$axios.get("/Event")
                .then(res => res.data)
                .catch(err => console.log(err))
            // return eventData
        },

        initEvent() {
            Object.assign(this.newEvent, this.EMPTY_EVENT)
        },

        createEvent() {
            this.newEvent.eventTime = new Date(this.newEvent.eventTime).toISOString()
            this.$axios.post("/Event/Create", this.newEvent)
                .then(() => {
                    this.$notify({
                        title: 'Success creating event',
                        type: 'success'
                    });
                    this.$router.go()
                }).catch((err) => {
                    this.$notify({
                        title: 'Error',
                        text: `Error creating event info ${err}`,
                        type: 'error'
                    });
                })
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