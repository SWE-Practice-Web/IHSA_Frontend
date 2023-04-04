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
                    <input type="text" class="form-control fs-3" :value="eventSelected.admins">
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
export default {
    props: ['eventSelected'],
    name: 'eventInfoTable',
}
</script>

<style>

</style>