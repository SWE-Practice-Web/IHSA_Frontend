<template>
    <div class="homeContainer">
        <table class="regionTable">
            <thead>
                <tr>
                    <th>School</th>
                    <th>Riders</th>
                    <th>Anchoor School</th>
                    <th>Average Distance</th>
                    <th>Maximum Distance</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="school in schoolsInSelectedRegion()" :key="school.featureId">
                    <td><a class='kinda-link' @click='selectSchoolInMap(school.featureId)'>{{ school.schoolName }}</a></td>
                    <td>{{ school.numOfRiders == "" ? 0 : school.numOfRiders }}</td>
                    <td>{{ school.isAnchorSchool ? 'yes' : 'no' }}</td>
                    <td>{{ Math.round(school.avgMileageInRegion * 100) / 100 }}</td>
                    <td>{{ Math.round(school.maxMileageInRegion * 100) / 100 }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>

export default {
    name: 'HomePage',
}
</script>

<style>
.homeContainer {
  height:100%;
  width:100%;
  background-color:red;
}
</style>
