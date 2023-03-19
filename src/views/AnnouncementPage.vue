<template>
    <div class="d-flex flex-column align-content-center text-bg-dark w-100 h-100 mx-auto">
        <div class="vstack gap-4 align-items-center p-5">
            <!-- create new announcement button -->
            <button v-if="role=='Admin'" class="btn btn-lg btn-dark" style="outline: 1px solid rgb(68, 68, 68);" @click="createNew">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-plus-lg" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
                </svg>
            </button>

            <!-- list of announcements -->
            <div class="d-flex flex-row announcement p-4" v-for="announcement in announcements" :key="announcement.text">
                <div class="message fs-3" @click="expand(announcement)">
                    {{ announcement.text }}
                </div>
                <!-- only show if Admin -->
                <div v-if="role=='Admin'" class="d-flex flex-column buttons" >
                    <button class="btn btn-dark m-1" @click="edits(announcement)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-pencil" viewBox="0 0 16 16">
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                        </svg>
                    </button>
                    <button class="btn btn-dark m-1" @click="deletes(announcement)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-trash3" viewBox="0 0 16 16">
                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- pop up modal for editting pre-existing announcement -->
    <div class="modal" id="editModal">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-body fs-2" contenteditable>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-danger btn-lg fs-6 d-flex align-items-center justify-content-center" @click="close('editModal')">Cancel</button>
                    <button class="btn btn-success btn-lg fs-6 d-flex align-items-center justify-content-center" @click="saveChanges">Save Changes</button>
                </div>
            </div>
        </div>
    </div>

    <!-- modal for creating a new announcement -->
    <div class="modal" id="createModal">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-body fs-2" contenteditable>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-danger btn-lg fs-6 d-flex align-items-center justify-content-center" @click="close('createModal')">Cancel</button>
                    <button class="btn btn-success btn-lg fs-6 d-flex align-items-center justify-content-center" @click="create">Create</button>
                </div>
            </div>
        </div>
    </div>

    <!-- delete confirmation pop-up -->
    <div class="modal" id="confirmDelete">
        <div class="modal-dialog modal-dialog-centered modal-sm">
            <div class="modal-content">
                <div class="modal-body fs-2" contenteditable>
                    Are you sure?
                </div>
                <div class="modal-footer d-flex align-items-center justify-content-center">
                    <button class="btn btn-danger btn-lg fs-6 d-flex align-items-center justify-content-center" @click="close('confirmDelete')">Cancel</button>
                    <button class="btn btn-success btn-lg fs-6 d-flex align-items-center justify-content-center" @click="confirm">Confirm</button>
                </div>
            </div>
        </div>
    </div>

    <!-- view whole announcmenet in a scrollable modal -->
    <div class="modal" id="expandModal">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <button class="btn-close" @click="close('expandModal')"></button>
                <div class="modal-body fs-2">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { reactive } from 'vue' 
export default {
    name: 'AnnouncementPage',
    setup() {
        let announcements = reactive([
            { date: '11 Aug 2022', event: 'Northwest Missouri State Open Show', text: 'Congratulations to all of the riders that moved up a division! Keep up the good work.' },
            { date: '12 Aug 2022', event: 'Iowa State Rally Show', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
            { date: '13 Aug 2022', event: 'MO State Open Show', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
            { date: '14 Aug 2022', event: 'Blackhawk College Open Show', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' }

        ]),
        role = "Admin", // change to 'User' to see other view
        currAnnouncement = null

        return {
            announcements,
            role,
            currAnnouncement
        }
    },
    methods: {
        edits: function(announcement) {
            // get selected announcment and put it into the edit modal
            this.currAnnouncement = announcement
            let editModal = document.getElementById('editModal')
            let modalText = editModal.querySelector('.modal-body')
            modalText.innerHTML = announcement.text
            editModal.style.display = 'block'
        },
        deletes: function(announcement) {
            // get selected announcment and show delete confimation
            this.currAnnouncement = announcement
            let deleteModal = document.getElementById('confirmDelete')
            deleteModal.style.display = 'block'
        },
        close: function(modalID) {
            // closes the given modal
            document.getElementById(modalID).style.display = 'none'
        },
        saveChanges: function() {
            // after edit complete, make changes to announcment and close modal
            let editModal = document.getElementById('editModal')
            let modalText = editModal.querySelector('.modal-body').innerHTML
            this.currAnnouncement.text = modalText
            editModal.style.display = 'none'
        },
        confirm: function() {
            // delete announcement after confirm and close modal
            let index = this.announcements.indexOf(this.currAnnouncement)
            this.announcements.splice(index, 1)
            let deleteModal = document.getElementById('confirmDelete')
            deleteModal.style.display = 'none'
        },
        expand: function(announcement) {
            // show the full announcement
            let expandModal = document.getElementById('expandModal')
            let modalText = expandModal.querySelector('.modal-body')
            modalText.innerHTML = announcement.text
            expandModal.style.display = 'block'
        },
        createNew: function() {
            // show empty creation modal
            let createModal = document.getElementById('createModal')
            createModal.querySelector('.modal-body').innerHTML = ''
            createModal.style.display = 'block'
        },
        create: function(event) {
            // add new announcement to the array and close modal
            let newText = event.target.parentNode.previousElementSibling.innerHTML
            let newAnnouncement = { date: '', event: '', text: newText}
            this.announcements.unshift(newAnnouncement)
            let createModal = document.getElementById('createModal')
            createModal.style.display = 'none'
        }
    }
}

</script>

<style scoped>
.announcement {
    height: 17%;
    width: 90%;
    border-radius: 5px;
    outline: 1px solid rgb(68, 68, 68);
    background-color: #2B3035;
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
    user-select: none;
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
}
</style>