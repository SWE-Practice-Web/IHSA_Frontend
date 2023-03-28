<template>
    <div>
        <h1>Manage Horse Information</h1>
        
        <div class="d-flex justify-content-center align-items-center w-100 h-100">
            <table class="table table-striped w-50 border border-primary">
                <thead class="table-dark">
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Provider</th>
                        <th scope="col">Spurs</th>
                        <th scope="col">Reign</th>
                        <th scope="col">Minimum Weight</th>
                        <th scope="col">Description</th>
                        <th scope="col">Edit</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="horse in horseList" :key="horse.name">
                        <td>{{ horse.name }}</td>
                        <td>{{ horse.provider }}</td>
                        <td>{{ horse.spurs }}</td>
                        <td>{{ horse.reign }}</td>
                        <td>{{ horse.mweight }}</td>
                        <td> <button @click="selectMessage(horse.desc)" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">Desc</button> </td>
                        <td> <button @click="selectMessage(horse.name)" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editHorse">Edit</button> </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Modal for horse description -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Horse Description</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                <p> {{ msg }} </p>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal for editing horse info -->
    <div class="modal fade" id="editHorse" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Edit Horse Info</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <h5>Horse Name: 
                        <input v-model="msg" id="horseName" placeholder="Name">
                    </h5>
                    <br/>
                    <h4>Provider: 
                        <input id="horseProvider" placeholder="Aa">
                    </h4>
                    <br>
                    <h4>Spurs: 
                        <input id="horseSpurs" placeholder="Aa">
                    </h4>
                    <h4>Reign: 
                        <input id="horseReign" placeholder="Aa">
                    </h4>
                    <h4>Minimum Weight: 
                        <input id="horseMinWeight" placeholder="Aa">
                    </h4>
                    <h4>Description</h4>
                    <textarea id="data" style="width: 350px; height: 170px" rows="10" cols="80"></textarea>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Save changes</button>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import {ref} from 'vue'
    export default {
        name: 'HorseListAdmin',
        setup() {
            let horseList = [
                {name: "Sheldon", provider: "BHC", spurs: "Optional Rowel", reign: "2 Hands", mweight: "100 lbs", desc: "Sheldon is a horse"},
                {name: "Roan Jack", provider: "BHC", spurs: "Optional Rowel", reign: "2 Hands", mweight: "No Restriction", desc: "This guy is a horse"},
                {name: "Rico", provider: "BHC", spurs: "Optional Rowel", reign: "2 Hands", mweight: "150 lbs", desc: "Lorem Ipsum"},
                {name: "Wayne", provider: "BHC", spurs: "Optional Rowel", reign: "2 Hands", mweight: "200 lbs", desc: "Baby Back Ribs"},
                {name: "Rey", provider: "UWP", spurs: "Optional", reign: "2 Hands", mweight: "No Restriction", desc: "This horse is rad"},
                {name: "Chad", provider: "ISU", spurs: "Optional", reign: "1 Hand", mweight: "120 lbs", desc: "This horse is ight"},
                {name: "Garth", provider: "ISU", spurs: "Optional", reign: "1 Hand", mweight: "No Restriction", desc: "Blame it all on his roots"}
            ];
            let msg = ref("404 not found")
            return {
                horseList,
                msg
            }
        },
        methods: {
            selectMessage(desc) {
                this.msg = desc
            }
        }
    }
</script>


<style>
    h3{
        font-size: 200% !important;
    }
    h4{
        font-size: 120% !important;
    }
    h5{
        font-size: 150% !important;
    }
    .noNewLine{
        display: inline;
    }
</style>