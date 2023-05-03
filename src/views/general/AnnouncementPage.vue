<template>
    <div class="d-flex flex-column align-content-center text-bg-light w-100 h-100 mx-auto">
        <div class="vstack gap-4 align-items-center p-5">
            <!-- create new announcement button -->
            <button v-if="role == 4" class="btn btn-lg btn-success" style="outline: 1px solid rgb(68, 68, 68);"
                data-bs-toggle="modal" data-bs-target="#createModal" @click="createNew">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-plus-lg"
                    viewBox="0 0 16 16">
                    <path fill-rule="evenodd"
                        d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
                </svg>
            </button>

            <!-- list of announcements -->
            <div class="d-flex flex-row rounded announcement p-4" v-for="announcement in sortedAnnouncements"
                :key="announcement.text">
                <div class="message fs-3" role="button" data-bs-toggle="modal" data-bs-target="#expandModal"
                    @click="selectAnnouncement(announcement)">
                    {{ announcement.text }}
                </div>
                <!-- only show if Admin -->
                <div v-if="role == 4" class="d-flex flex-column buttons">
                    <button class="btn btn-success m-1" @click="selectAnnouncement(announcement)" data-bs-toggle="modal"
                        data-bs-target="#editModal">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-pencil"
                            viewBox="0 0 16 16">
                            <path
                                d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                        </svg>
                    </button>
                    <button class="btn btn-success m-1" @click="selectAnnouncement(announcement)" data-bs-toggle="modal"
                        data-bs-target="#deleteModal">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-trash3"
                            viewBox="0 0 16 16">
                            <path
                                d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>


    <!-- Edit Announcement Modal -->
    <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editModalLabel">Edit Announcement</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <textarea class="modal-body m-3" v-model="currAnnouncement.text">
                </textarea>
                <div class="modal-footer">
                    <button class="btn btn-danger btn-lg fs-6 d-flex align-items-center justify-content-center"
                        data-bs-dismiss="modal">Cancel</button>
                    <button class="btn btn-success btn-lg fs-6 d-flex align-items-center justify-content-center"
                        data-bs-dismiss="modal" @click="editAnnouncement">Save Changes</button>
                </div>
            </div>
        </div>
    </div>


    <!-- Create Announcement Modal -->
    <div class="modal fade" id="createModal" tabindex="-1" aria-labelledby="createModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="createModalLabel">Create Announcement</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <textarea class="modal-body m-3" v-model="currAnnouncement.text">
                </textarea>
                <div class="modal-footer">
                    <button class="btn btn-danger btn-lg fs-6 d-flex align-items-center justify-content-center"
                        data-bs-dismiss="modal">Cancel</button>
                    <button class="btn btn-success btn-lg fs-6 d-flex align-items-center justify-content-center"
                        data-bs-dismiss="modal" @click="createAnnouncement">Save Changes</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Delete Announcement Modal -->
    <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body fs-2">
                    Are you sure you want to delete this announcement?
                </div>
                <div class="modal-footer">
                    <button class="btn btn-danger btn-lg fs-6 d-flex align-items-center justify-content-center"
                        data-bs-dismiss="modal">Cancel</button>
                    <button class="btn btn-success btn-lg fs-6 d-flex align-items-center justify-content-center"
                        data-bs-dismiss="modal" @click="deleteAnnouncement">Delete</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Expand Announcement Modal -->
    <div class="modal fade" id="expandModal" tabindex="-1" aria-labelledby="expandModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body fs-2 p-5">
                    {{ currAnnouncement.text }}
                </div>
            </div>
        </div>
    </div>


    <!-- view whole announcmenet in a scrollable modal -->
    <!-- <div class="modal" id="expandModal">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <button class="btn-close" @click="close('expandModal')"></button>
                <div class="modal-body fs-2">
                </div>
            </div>
        </div>
    </div> -->
</template>

<script>
import { reactive } from 'vue'
import { useStore } from 'vuex'
export default {
    name: 'AnnouncementPage',
    setup() {
        const store = useStore()
        let announcements = reactive({
            '1': { id: 1, date: '11 Aug 2022', event: 'Northwest Missouri State Open Show', text: 'Congratulations to all of the riders that moved up a division! Keep up the good work.' },
            '2': { id: 2, date: '12 Aug 2022', event: 'Iowa State Rally Show', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
            '3': { id: 3, date: '13 Aug 2022', event: 'MO State Open Show', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
            '4': { id: 4, date: '14 Aug 2022', event: 'Blackhawk College Open Show', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' }
        }),
        currAnnouncement = reactive({ id: null, date: '', event: '', text: '' }),
        idCounter = 5

        return {
            announcements,
            role: store.state.role,
            currAnnouncement,
            idCounter
        }
    },
    computed: {
        sortedAnnouncements() {
            return Object.values(this.announcements).sort((a, b) => new Date(b.date) - new Date(a.date));
        },
    },
    methods: {
        selectAnnouncement: function (announcement) {
            // get selected announcment and put it into the edit modal
            Object.assign(this.currAnnouncement, announcement)

            // this.currAnnouncement.text = anno
        },

        editAnnouncement: function () {
            // after edit complete, make changes to announcment and close modal
            Object.assign(this.announcements[this.currAnnouncement.id], this.currAnnouncement)

        },

        deleteAnnouncement: function () {
            // delete announcement after confirm and close modal
            const currAnnouncementId = this.currAnnouncement.id
            delete this.announcements[currAnnouncementId]
        },

        createNew: function () {
            // show empty creation modal
            const newAnnouncement = { id: null, date: new Date(), event: '', text: '' }
            Object.assign(this.currAnnouncement, newAnnouncement)
        },

        createAnnouncement: function () {
            // Once we connect to backend here we would make a post with the new announcement without the Id and get the new announcement
            // with its new id back
            // const newAnnouncement = axios.post("/annoucement", this.currAnnouncement)
            // For now we just use a counter for the ids
            let newAnnouncement = { ...this.currAnnouncement }
            newAnnouncement.id = this.idCounter++
            this.announcements[newAnnouncement.id] = newAnnouncement
        }
    }
}

</script>

<style scoped>
/* * {
    color: white;
} */
.announcement {
    height: 17%;
    width: 90%;
    outline: 1px solid rgb(206, 206, 206);
    background-color: rgb(235,235,235);
}

.message {
    width: 100%;
    height: 96px;
    text-align: left;
    display: block;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    /* user-select: none; */
}

.buttons button {
    width: 45px;
    height: 45px;
    outline: 1px solid rgb(68, 68, 68);
}

.btn-lg {
    width: 130px;
    height: 40px;
}

.btn-close {
    position: absolute;
    right: 5px;
    top: 5px;
    z-index: 9999;
}</style>