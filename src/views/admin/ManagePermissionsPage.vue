<template>
    <div class="container">
        <div class="d-flex justify-content-between align-items-center">
            <input class="h-25 w-50 form-control" type="text" v-model="input" placeholder="Search" />

            <select v-model="selected_role" class="form-select h-25 w-25">
                <option value="null">All roles</option>
                <option v-for="role in roles" :value="role" :key="role">{{ role }}</option>
            </select>
        </div>
        <div>
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Rider ID</th>
                        <th scope="col">First</th>
                        <th scope="col">Last</th>
                        <th scope="col">Email</th>
                        <th scope="col">School</th>
                        <th scope="col">Permission</th> <!--Modified column header-->
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in filteredList" :key="user.id">
                        <th scope="row">{{ user.id }}</th>
                        <td>{{ user.first }}</td>
                        <td>{{ user.last }}</td>
                        <td>{{ user.email }}</td>
                        <td>{{ user.school }}</td>
                        <!--Modified column-->
                        <td>
                            <select v-model="user.role" class="form-select">
                                <option v-for="role in roles" :value="role" :key="role">{{ role }}</option>
                            </select>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'
export default {
    name: 'managePermissions',
    setup() {
        let user = ref(null)
        let input = ref("")
        let selected_role = ref("null")
        let roles = ["User", "Admin", "Coach"]
        let users = [
            { id: 1, first: 'Chase', last: 'Smith', email: 'smithchase@gmail.com', school: '', role: 'User' },
            { id: 2, first: 'Morgan', last: 'Johnson', email: 'mjohnson@hotmail.com', school: '', role: 'User' },
            { id: 3, first: 'Blake', last: 'Hosey', email: 'blakeboss@gmail.com', school: '', role: 'User' },
            { id: 4, first: 'Jasmine', last: 'Ghoul', email: 'brojas@gmail.com', school: '', role: 'User' },
            { id: 5, first: 'Yote', last: 'Weaver', email: 'yweaver@gmail.com', school: '', role: 'User' },
            { id: 6, first: 'Becky', last: 'Cash', email: 'cashbecky@gmail.com', school: '', role: 'User' },
            { id: 7, first: 'Harry', last: 'Pope', email: 'wizardpope@gmail.com', school: '', role: 'User' },
            { id: 8, first: 'Bronson', last: 'George', email: 'gbronson@gmail.com', school: '', role: 'User' }
        ]
        return {
            user,
            input,
            users,
            roles,
            selected_role
        }
    },
    computed: {
        filteredList() {
            return this.users.filter((user) => {
                const elements_to_check = [user.first, user.last, user.email, user.school]
                const check_function = (text) => text.toLowerCase().startsWith(this.input.toLowerCase())
                if (this.selected_role != "null" && user.role != this.selected_role) {
                    return false
                }
                if (this.input == "") {
                    return true
                } else {
                    return elements_to_check.some(check_function)
                }
            })
        }
    }
}
</script>

<style scoped>

.container {
    padding: 20px;
    min-height: 93vh;
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