<template>
    <div>
        <br>
        <button v-if="!isHidden" @click="currentComp = 'HorseAddEdit'; isHidden = true; " type="button" class="btn btn-primary">Add Horse Info</button>
        <button v-if="isHidden" @click="currentComp = 'HorseListAdmin'; isHidden = false; " type="button" class="btn btn-primary">Back to Manage</button>
        <button v-if="isHidden" type="button" class="btn btn-primary">Upload .csv</button>
        <div>
            <component v-bind:is="currentComp"></component>
        </div>
    </div>
</template>

<script>
    import HorseListAdmin from '../components/HorseListAdmin.vue'
    import HorseAddEdit from '../components/HorseAddEdit.vue'
    
    export default {
        name: 'ManageHorsePage',
        components: {
            HorseListAdmin,
            HorseAddEdit
       },
       data() {
        return {
            currentComp: 'HorseListAdmin',
            isHidden: false
            }
        }
    
    }
</script>

<style>
    
    h1{
        font-size: 300% !important;
    }
    
</style>