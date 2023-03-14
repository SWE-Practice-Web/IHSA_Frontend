<template class="manageEventContainer">
    <div class="d-flex justify-content-center align-items-center w-100 h-100 bg-light">
        <h1>Manage Events</h1>
        <b-dropdown id="contest-dropdown-left" text="Selected Contest Name" variant="primary" class="m-md-2">
            <b-dropdown-item>Contest 1</b-dropdown-item>
            <b-dropdown-item>Contest 2</b-dropdown-item>
            <b-dropdown-item>Contest 3</b-dropdown-item>
        </b-dropdown>
    </div>

</template>

<script>
export default {
    name: 'ManageEventPage'
}
</script>

<style>
.manageEventContainer{
    height: 100%;
    width: 100%;
    background-color: lightcyan;
}
</style>