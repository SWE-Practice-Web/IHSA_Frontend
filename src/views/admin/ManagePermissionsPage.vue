<template>
    <div class="container">
        <div class="d-flex justify-content-between align-items-center">
            <input class="h-25 w-50 form-control" type="text" v-model="input" placeholder="Search" />

            <select v-model="selected_role" class="form-select h-25 w-25">
                <option value="null">All roles</option>
                <option v-for="role in roles" :value="role" :key="role">{{ role == 0 ? 'User' : 'Admin' }}</option>
            </select>
        </div>
        <div>
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">First</th>
                        <th scope="col">Last</th>
                        <th scope="col">Email</th>
                        <th scope="col">Permission</th> <!--Modified column header-->
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in filteredList" :key="user.id">
                        <td>{{ user.firstName }}</td>
                        <td>{{ user.lastName }}</td>
                        <td>{{ user.email }}</td>
                        <!--Modified column-->
                        <td>
                            <select v-model="user.role" class="form-select" @change="updateUser(user)">
                                <option v-for="role in roles" :value="role" :key="role">{{ role == 0 ? 'User' : 'Admin' }}
                                </option>
                            </select>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import { ref, reactive } from 'vue'
export default {
    name: 'managePermissions',
    setup() {
        let user = ref(null)
        let input = ref("")
        let selected_role = ref("null")
        let roles = [0, 4]
        let users = reactive([])
        let usersBackup = [
            { id: 1, first: 'Chase', last: 'Smith', email: 'smithchase@gmail.com', role: 0 },
            { id: 2, first: 'Morgan', last: 'Johnson', email: 'mjohnson@hotmail.com', role: 4 },
            { id: 3, first: 'Blake', last: 'Hosey', email: 'blakeboss@gmail.com', role: 0 },
            { id: 4, first: 'Jasmine', last: 'Ghoul', email: 'brojas@gmail.com', role: 0 },
            { id: 5, first: 'Yote', last: 'Weaver', email: 'yweaver@gmail.com', role: 4 },
            { id: 6, first: 'Becky', last: 'Cash', email: 'cashbecky@gmail.com', role: 0 },
            { id: 7, first: 'Harry', last: 'Pope', email: 'wizardpope@gmail.com', role: 'Coach' },
            { id: 8, first: 'Bronson', last: 'George', email: 'gbronson@gmail.com', role: 0 }
        ]
        return {
            user,
            input,
            users,
            usersBackup,
            roles,
            selected_role
        }
    },
    async mounted() {
        await this.getUsers()
    },
    computed: {
        filteredList() {
            return this.users.filter((user) => {
                const elements_to_check = [user.firstName, user.lastName, user.email]
                const check_function = (text) => text.toLowerCase().startsWith(this.input.toLowerCase())
                if (this.selected_role != "null" && user.role != this.selected_role) {
                    console.log("1")
                    return false
                }
                if (this.input == "") {
                    console.log("2")
                    return true
                } else {
                    console.log("3")
                    return elements_to_check.some(check_function)
                }
            })
        }
    },
    methods: {
        async updateUser(user) {
            try {
                await this.$axios.put(`/User/${user.id}`, user)

            } catch (err) {
                this.$notify({
                    title: 'Error',
                    text: `Error updating user: ${user.firstName} ${user.lastName}`,
                    type: 'error'
                });
            }
        },

        getUsers() {
            return this.$axios.get('/User/GetAll')
                .then((res) => {
                    this.users.push(...res.data)
                })
                .catch((err) => {
                    this.$notify({
                        title: 'Error',
                        text: `Error loading users from database. Showing latest backup: ${err}`,
                        type: 'error'
                    });
                    this.users.push(...this.usersBackup)
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