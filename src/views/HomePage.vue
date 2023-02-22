<template class="homeContainer">
    <div class="d-flex justify-content-center align-items-center w-100 h-100 bg-light">
        <table class="table table-striped w-50 border border-primary">
            <thead class="table-dark">
                <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Age</th>
                    <th scope="col">Height</th>
                    <th scope="col">Weight</th>
                    <th scope="col">Color</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="horse in horseList" :key="horse.name">
                    <td>{{ horse.name }}</td>
                    <td>{{ horse.age }}</td>
                    <td>{{ horse.height }}</td>
                    <td>{{ horse.weight }}</td>
                    <td>{{ horse.color }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>

export default {
    name: 'HomePage',
    setup() {
        let horseList = [
            { name: "Thunder", age: 5, height: 16.2, weight: 1200, color: "black" },
            { name: "Buddy", age: 7, height: 15.3, weight: 1100, color: "bay" },
            { name: "Daisy", age: 3, height: 14.2, weight: 900, color: "palomino" },
            { name: "Spirit", age: 4, height: 16.0, weight: 1250, color: "chestnut" },
            { name: "Sunny", age: 6, height: 15.1, weight: 1050, color: "buckskin" },
            { name: "Max", age: 8, height: 16.3, weight: 1300, color: "gray" },
            { name: "Angel", age: 10, height: 15.2, weight: 1000, color: "white" },
            { name: "Charlie", age: 2, height: 13.2, weight: 800, color: "roan" },
            { name: "Apollo", age: 9, height: 17.1, weight: 1400, color: "dapple gray" },
            { name: "Luna", age: 6, height: 14.3, weight: 1000, color: "black and white" }
        ];
        return {
            horseList
        }
    }
}
</script>

<style>
.homeContainer {
    height: 100%;
    width: 100%;
    background-color: lightcyan;
}
</style>
