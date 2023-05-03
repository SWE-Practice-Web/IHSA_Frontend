<template>
    <div class="container mt-3 p-4 bg-secondary rounded w-75" id="eventInfo">
        <div class="col">
            <div class="row">
                <div class="input-group m-2">
                    <span class="input-group-text fs-4">Name</span>
                    <input type="text" class="form-control fs-4" v-model="eventInfo.location">
                </div>
            </div>
            <div class="row">
                <div class="input-group m-2">
                    <span class="input-group-text fs-4">Riding Patterns (URL)</span>
                    <input type="url" class="form-control fs-6" v-model="eventInfo.ridingPattern">
                </div>
            </div>
            <div class="row">
                <div class="input-group m-2">
                    <span class="input-group-text fs-4">Date</span>
                    <input type="date" class="form-control fs-4" v-model="eventInfo.eventTime">
                </div>
            </div>
            <div class="row">
                <div class="input-group m-2">
                    <span class="input-group-text fs-4">Description</span>
                    <input type="text" class="form-control fs-4" v-model="eventInfo.description">
                </div>
            </div>
        </div>
        <div class="d-flex justify-content-between">
            <button class="btn btn-lg btn-success fs-4 mt-2" @click="deleteEvent">
                Delete Event
            </button>
            <button class="btn btn-lg btn-success fs-4 mt-2" @click="updateEvent">
                Save Event
            </button>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'

export default {
    name: 'eventInfoTable',
    props: ['event'],
    setup(props) {
        let admins = ['Bert Young', 'Brenda Ghost', 'Jackie Brown']
        let selectedAdmins = ref([])
        let eventInfo = Object.assign({}, props.event)
        if (eventInfo.eventTime) {
            eventInfo.eventTime = new Date(eventInfo.eventTime).toISOString().substring(0, 10);
        }
        console.log(eventInfo)
        return {
            admins,
            selectedAdmins,
            eventInfo
        }
    },
    methods: {
        updateEvent() {
            this.eventInfo.eventTime = new Date(this.eventInfo.eventTime).toISOString()
            this.$axios.put(`/Event/${this.eventInfo.id}`, this.eventInfo)
                .then(() => {
                    this.$notify({
                        title: 'Success updating event info',
                        type: 'success'
                    });
                    this.$router.go()
                }).catch((err) => {
                    this.$notify({
                        title: 'Error',
                        text: `Error updating event info ${err}`,
                        type: 'error'
                    });
                })
        },

        deleteEvent() {
            this.$axios.delete(`/Event/${this.eventInfo.id}`)
                .then(() => {
                    this.$notify({
                        title: 'Success deleting event',
                        type: 'success'
                    });
                    this.$router.go()
                }).catch((err) => {
                    this.$notify({
                        title: 'Error',
                        text: `Error deleting event: ${err}`,
                        type: 'error'
                    });
                })
        }
    },
}
</script>

<style>
#eventInfo {
    outline: 1px solid rgb(206, 206, 206);
    background-color: rgb(235,235,235);
}
</style>