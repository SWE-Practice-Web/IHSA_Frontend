<template>
    <div class="container mt-3 p-4 bg-secondary rounded w-75">
        <div class="col">
            <div class="row">
                <div class="input-group m-2">
                    <span class="input-group-text fs-4">Name</span>
                    <input type="text" class="form-control fs-4" :value="eventInfo.location">
                </div>
            </div>
            <div class="row">
                <div class="input-group m-2">
                    <span class="input-group-text fs-4">Admins</span>
                    <input type="text" class="form-control fs-4" :value="selectedAdmins">
                    <select class="select w-100"  @change="onChange" multiple>
                        <option v-for="admin in admins" :value="admin" :key="admin" class="fs-4">{{ admin }}</option>
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="input-group m-2">
                    <span class="input-group-text fs-4">Date</span>
                    <input type="text" class="form-control fs-4" :value="eventInfo.eventTime">
                </div>
            </div>
            <div class="row">
                <div class="input-group m-2">
                    <span class="input-group-text fs-4">Description</span>
                    <input type="text" class="form-control fs-4" :value="eventInfo.description">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useStore } from 'vuex'
import { ref, reactive } from 'vue' 

export default {
    setup() {
        let admins = ['Bert Young', 'Brenda Ghost', 'Jackie Brown']
        let selectedAdmins = ref([])
        const store = useStore()
        let eventInfo = reactive(store.state.eventInfo)



        return {
            admins,
            selectedAdmins,
            eventInfo
        }
    },
    methods: {
        onChange: function(event) {
            let selected = event.target.selectedOptions
            let temp = []
            
            for (let i = 0; i < selected.length; i++)
            {
                let admin = selected[i].value
                temp.push(admin)
            }
            this.selectedAdmins = temp
        }
    },
    name: 'eventInfoTable',
}
</script>

<style>

</style>