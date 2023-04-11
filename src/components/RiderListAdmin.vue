<template>
    <div>
        <h1>Manage Rider Information</h1>
        <div class="d-flex justify-content-center align-items-center w-100 h-100">
            <table class="table table-striped w-50 border border-primary">
                <thead class="table-dark">
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">ID</th>
                        <th scope="col">University</th>
                        <th scope="col">Height</th>
                        <th scope="col">Weight</th>
                        <th scope="col">Edit</th>
                        <th scope="col">Delete</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(rider, index) in riderList" :key="index">
                        <td>{{ rider.name }}</td>
                        <td>{{ rider.id }}</td>
                        <td>{{ rider.university }}</td>
                        <td>{{ rider.height }}</td>
                        <td>{{ rider.weight }}</td>
                        <td> <button @click="editForm(rider, index)" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editRider">Edit</button> </td>
                        <td> <button @click="selectMessage(index)" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#areYouSure">Delete</button>  </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addRider">Add Rider to List</button>
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#uploadFile">Add Rider Data from .csv</button>
    </div>

    <!-- Modal for editing Rider info -->
    <div class="modal fade" id="editRider" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Edit Rider Info</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <h5>Rider Name: 
                        <input type="text"  v-model="editData.name" placeholder="Name">
                    </h5>
                    <br/>
                    <h4>ID: 
                        <input type="text" v-model="editData.id" placeholder="Aa">
                    </h4>
                    <br>
                    <h4>University: 
                        <input type="text" v-model="editData.university" placeholder="Aa">
                    </h4>
                    <h4>Height: 
                        <input type="text" v-model="editData.height" placeholder="Aa">
                    </h4>
                    <h4>Weight: 
                        <input type="text" v-model="editData.weight" placeholder="Aa">
                    </h4>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="updateData">Save changes</button>
                </div>
            </div>
        </div>
    </div>

    <!--Modal for adding Rider info-->
    <div class="modal fade" id="addRider" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Add Rider Info</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <h5>Rider Name: 
                        <input type = "text" v-model = "newData.name"  placeholder="Name">
                    </h5>
                    <br/>
                    <h4>ID: 
                        <input type="text" v-model="newData.provider" placeholder="Aa">
                    </h4>
                    <br>
                    <h4>University: 
                        <input type="text" v-model="newData.spurs" placeholder="Aa">
                    </h4>
                    <h4>Height: 
                        <input type="text" v-model="newData.reign" placeholder="Aa">
                    </h4>
                    <h4>Weight: 
                        <input type="text" v-model="newData.weight" placeholder="Aa">
                    </h4>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-primary" @click="addData" data-bs-dismiss="modal">Submit</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Are you sure? Modal -->
    <div class="modal fade" id="areYouSure" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Attention</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <h5>
                        Are you sure you want to delete this rider?
                    </h5>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="deleteData(msg)">Confirm</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Upload .csv modal -->
    <div class="modal fade" id="uploadFile" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Upload File</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <h5>
                        <input class="form-control" type="file" accept=".csv" ref="fileInput">
                    </h5>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="handleFileUpload">Confirm</button>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    import {ref, reactive} from 'vue'
    import Papa from 'papaparse'
    export default {
        name: 'RiderListAdmin',
        setup() {
            let riderList = reactive([
                {name: 'Alison Weiser', id: '405', university: 'Illinois State University', height: "6'1", weight: '100lbs'},
                {name: 'Kylie Novak', id: '120', university: 'Illinois State University', height: "5'9", weight: '156lbs3'},
                {name: 'Brooke Lee', id: '234', university: 'Iowa State University', height: "5'7", weight: '150lbs'},
                {name: 'Heather Marz', id: '321', university: 'Kansas State University', height: "5'9", weight: '200lbs'},
                {name: 'Kammi Bishop', id: '543', university: 'Iowa State University', height: "6'1", weight: '134lbs'},
                {name: 'Zoie Havick', id: '839', university: 'Kansas State University', height: "5'7", weight: '120lbs'},
                {name: 'Bailey Groves', id: '983', university: 'Kansas State University', height: "", weight: ''}
            ]);
            let msg = ref('404 not found')
            return {
                riderList,
                //msg,
                newData: {
                    name: '',
                    id: '',
                    university: '',
                    height: '',
                    weight: ''
                },
                editData: reactive({
                    name: '',
                    id: '',
                    university: '',
                    height: '',
                    weight: ''
                })
            }
        },
        methods: {
            selectMessage(mess) {
                this.msg = mess
            },
            addData() {
                this.riderList.push({ ...this.newData })
                this.riderList.name = ''
                this.riderList.id = ''
                this.riderList.university = ''
                this.riderList.height = ''
                this.riderList.weight = ''
            },
            editForm(rider, index) {
                this.editData.name = rider.name
                this.editData.id = rider.id
                this.editData.university = rider.university
                this.editData.height = rider.height
                this.editData.weight = rider.weight
                this.editData.index = index
            },
            updateData() {
                this.riderList[this.editData.index] = {...this.editData}
            },
            deleteData () {
                this.riderList.splice(index, 1)
            },
            handleFileUpload() {
                const file = this.$refs.fileInput.files[0]
                const reader = new FileReader()
                reader.readAsText(file)
                reader.onload = () => {
                    const csvData = reader.result
                    const results = Papa.parse(csvData, {header: true})
                    const newRiders = results.data
                    for (let rider of newRiders) {
                        this.riderList.push(rider)
                    }
                    this.riderList.pop()
                }
            }
        }
        
    }

</script>

<style>


</style>