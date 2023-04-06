<template>
    <div class="container mt-3 bg-secondary rounded w-75">
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
                    <input type="text" class="form-control fs-3" :value="selectedAdmins">
                    <select class="select w-100"  @change="onChange" multiple>
                        <option v-for="admin in admins" :value="admin" :key="admin" class="fs-3">{{ admin }}</option>
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="input-group m-2">
                    <span class="input-group-text fs-3">Date</span>
                    <input type="text" class="form-control fs-3" :value="eventSelected.date">
                </div>
            </div>
            <div class="row">
                <div class="input-group m-2">
                    <span class="input-group-text fs-3">Description</span>
                    <input type="text" class="form-control fs-3" :value="eventSelected.description">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue' 

export default {
    setup() {
        let admins = ['Bert Young', 'Brenda Ghost', 'Jackie Brown']
        let selectedAdmins = ref([])

        return {
            admins,
            selectedAdmins,
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
    props: ['eventSelected'],
    name: 'eventInfoTable',
}
</script>

<style>

</style>