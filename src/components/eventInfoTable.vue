<template>
    <div class="container mt-3 text-bg-light rounded w-75" id="eventInfo">
        <div class="col">
            <div class="row">
                <div class="input-group m-2">
                    <span class="input-group-text fs-3">Name</span>
                    <input type="text" class="form-control fs-3" :value="eventSelected.name">
                </div>
            </div>
            <div class="row">
                <div class="input-group m-2">
                    <span class="input-group-text fs-3">Admins</span>
                </div>
            </div>
            <div class="row"></div>
                <ul class="list-group">
                    <li class="list-group-item m-2 rounded d-flex justify-content-start" v-for="admin in admins" :key="admin">
                        <input class="form-check-input fs-3 mx-3" type="checkbox" :value="admin" v-bind:checked="eventSelected.admins.includes(admin)">
                        <label class="form-check-label fs-3">{{ admin }}</label>
                    </li>
                </ul>
            <div class="row">
                <div class="input-group m-2">
                    <span class="input-group-text fs-3">Date</span>
                    <input type="date" class="form-control fs-3" :value="eventSelected.date">
                </div>
            </div>
            <div class="row">
                <div class="input-group m-2">
                    <span class="input-group-text fs-3">Riding Patterns</span>
                    <input type="text" class="form-control fs-3" :value="eventSelected.ridingPattern">
                </div>
            </div>
            <div class="row">
                <div class="input-group m-2">
                    <span class="input-group-text fs-3">Description</span>
                    <input type="text" class="form-control fs-3" :value="eventSelected.description">
                </div>
            </div>
            <div v-if="eventSelected.id != -1" class="row d-flex justify-content-end">
                <button class="btn btn-success m-2 fs-3" style="width:200px;" @click="saveEventInfo(eventSelected.id, admins.length)">Save Changes</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    setup() {
    },
    methods: {
        saveEventInfo: function(eventId, numAdmins) {
            let eventInfo = document.getElementById('eventInfo')
            let inputs = eventInfo.querySelectorAll('input')
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

            // use this info to write to db
            console.log('eventID: ' + eventId)
            console.log('eventName: ' + eventName)
            console.log('eventAdmins: ' + eventAdmins)
            console.log('eventDate: ' + eventDate)
            console.log('eventPatterns: ' + eventPatterns)
            console.log('eventDescription: ' + eventDescription)
        }
    },
    props: ['eventSelected', 'admins'],
    name: 'eventInfoTable',
}
</script>

<style>
#eventInfo {
    outline: 1px solid rgb(206, 206, 206);
    background-color: rgb(235,235,235);
}

</style>