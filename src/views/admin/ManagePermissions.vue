<template>
    <input type="text" v-model="input" placeholder="Search"/>
    <div class="item" v-for="user in filteredList()" :key="user.id">
        <p>{{ user.id }}</p>
    </div>
    <div class="error" v-if="input&&!filteredList().length">
        <p>No results found!</p>
    </div>
    <div>
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">First</th>
                    <th scope="col">Last</th>
                    <th scope="col">Email</th>
                    <th scope="col">School</th>
                    <th scope="col">Permission</th> <!--Modified column header-->
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in filteredList()" :key="user.id">
                    <th scope="row">{{ user.id }}</th>
                    <td>{{ user.first }}</td>
                    <td>{{ user.last }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.school }}</td>
                    <!--Modified column-->
                    <td>
                        <div class="dropdown">
                            <button
                            class="btn btn-secondary dropdown-toggle"
                            type="button"
                            id="dropdownMenuButton"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                            > {{user.permission || 'Select Permission'}} </button>
                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <a class="dropdown-item" :href="'/user/' + user.id">User</a>
                                <a class="dropdown-item" :href="'/coach/' + user.id">Coach</a>
                                <a class="dropdown-item" :href="'/admin/' + user.id">Admin</a>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import {ref} from "vue";

export default {
    name: 'managePermissions',
    data() {
        return {
            users: [
                {id: 1, first: 'Chase', last: 'Smith', email: 'smithchase@gmail.com', school: '', permission: ''},
                {id: 2, first: 'Morgan', last: 'Johnson', email: 'mjohnson@hotmail.com', school: '', permission: ''},
                {id: 3, first: 'Blake', last: 'Hosey', email: 'blakeboss@gmail.com', school: '', permission: ''},
                {id: 4, first: 'Jasmine', last: 'Ghoul', email: 'brojas@gmail.com', school: '', permission: ''},
                {id: 5, first: 'Yote', last: 'Weaver', email: 'yweaver@gmail.com', school: '', permission: ''},
                {id: 6, first: 'Becky', last: 'Cash', email: 'cashbecky@gmail.com', school: '', permission: ''},
                {id: 7, first: 'Harry', last: 'Pope', email: 'wizardpope@gmail.com', school: '', permission: ''},
                {id: 8, first: 'Bronson', last: 'George', email: 'gbronson@gmail.com', school: '', permission: ''}
            ]
        }
    }
}

let input = ref("");
const user = [
    {id: 1, first: 'Chase', last: 'Smith', email: 'smithchase@gmail.com', school: '', permission: ''},
    {id: 2, first: 'Morgan', last: 'Johnson', email: 'mjohnson@hotmail.com', school: '', permission: ''},
    {id: 3, first: 'Blake', last: 'Hosey', email: 'blakeboss@gmail.com', school: '', permission: ''},
    {id: 4, first: 'Jasmine', last: 'Ghoul', email: 'brojas@gmail.com', school: '', permission: ''},
    {id: 5, first: 'Yote', last: 'Weaver', email: 'yweaver@gmail.com', school: '', permission: ''},
    {id: 6, first: 'Becky', last: 'Cash', email: 'cashbecky@gmail.com', school: '', permission: ''},
    {id: 7, first: 'Harry', last: 'Pope', email: 'wizardpope@gmail.com', school: '', permission: ''},
    {id: 8, first: 'Bronson', last: 'George', email: 'gbronson@gmail.com', school: '', permission: ''}
];
function filteredList() {
    return u.filter((u) => u.toLowerCase().includes(input.value.toLowerCase()));
}
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Montserrat&display=swap");

* {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    font-family: "Montserrat" sans-serif;
}

body {
    padding: 20px;
    min-height: 100vh;
    background-color: rgb(234, 242, 255);
}

input {
    display: block;
    width: 350px;
    margin: 20px auto;
    padding: 10px 45px;
    background: white no repeat 15px center;
    background-size: 15px 15px;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
     rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
}

.item {
    width: 350px;
    margin: 0 auto 10px auto;
    padding: 10px 20px;
    color: white;
    border-radius: 5px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
    rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
}

.error {
    background-color: tomato;
}

</style>