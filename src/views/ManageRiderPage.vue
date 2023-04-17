<template>
    <div>
        <br>
        <div>
            <component v-bind:is="currentComp"></component>
        </div>
    </div>
</template>

<script>
    import RiderListAdmin from '../components/RiderListAdmin.vue'

    export default {
        name: 'ManageRiderPage',
        components: {
            RiderListAdmin
        },
        data() {
            return {
                currentComp: 'RiderListAdmin'
            }
        }
    }
</script>

<style>
    h1{
        font-size: 300% !important;
    }
</style>