<template>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Factory Cards</title>
    </head>
    <div>
    <div>
        <strong>Username:</strong> <span v-text="user.username"></span>
    </div>
    <div>
        <strong>Name:</strong> <span v-text="user.name"></span>
    </div>
    <div>
        <strong>Lastname:</strong> <span v-text="user.lastname"></span>
    </div>
    <div>
        <strong>Gender:</strong> <span v-text="user.gender"></span>
    </div>
    <div>
        <strong>Birth Date:</strong> <span v-text="user.birthDate"></span>
    </div>
    <div>
        <strong>Role:</strong> <span v-text="user.role"></span>
    </div>
    <div>
        <strong>Points:</strong> <span v-text="user.points"></span>
    </div>
    <div>
        <strong>Customer Type:</strong> <span v-text="user.customerType"></span>
    </div>
    <div>
        <button @click="updateUserModal(user)">Update</button>
    </div>
</div>
<div class="modal" v-if="isUpdateModalShown">
        <div class="modal-content">
        <span class="close" @click="isUpdateModalShown = false">&times;</span>
        <h2>Update User</h2>
        <form @submit.prevent="updateUser">
          <div class="form-group">
            <label for="name">Username:</label>
            <input type="text" v-model="updatedUser.username" required>
          </div>
          <div class="form-group">
            <label for="price">Name:</label>
            <input type="text" v-model="updatedUser.name" required>
          </div>
          <div class="form-group">
            <label for="name">Lastname:</label>
            <input type="text" v-model="updatedUser.lastname" required>
          </div>
          <div class="form-group">
            <label for="kind">Gender:</label>
            <input type="text" v-model="updatedUser.gender" required>
          </div>
          <div class="form-group">
            <label for="type">Birth date:</label>
            <input type="date" v-model="updatedUser.birthDate" required>
          </div>
          <div class="form-group">
            <label for="weight">Role:</label>
            <input type="text" v-model="updatedUser.role" required>
          </div>
          <div class="form-group">
            <label for="description">Points:</label>
            <input type="text" v-model="updatedUser.points" required>
          </div>
          <div class="form-group">
            <label for="image">Customer type:</label>
            <input type="text" v-model="updatedUser.customerType" required>
          </div>
            <button type="submit" class="submit-button">Submit</button>
        </form>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import {onMounted, ref} from 'vue';
import { useRouter, useRoute } from 'vue-router';

const updatedUser = ref({});
const isUpdateModalShown = ref(false);
const route = useRoute();
const router = useRouter();

const user = ref({username: "", name: "", lastname: "", gender: "", birthDate: "", role: "", points: 0, customerType: ""});
const users = ref([])
const username = route.params.username;

onMounted(() => {
    loadUser()
})

function loadUser() {
    axios.get('http://localhost:3000/users/' + username).then((response)=>{
      user.value = response.data
    }).catch(error => {
        console.error("Error loading the profile");
    });
}

function updateUser(){
    axios.patch('http://localhost:3000/users/' + updatedUser.value.id,
    updatedUser.value).then(response =>{
        user.value = response.data.user
        isUpdateModalShown.value = false;
    })
    .catch(error => {
        console.error("Error updating the user:", error);
    });
}

function updateUserModal(user){
    updatedUser.value = { ...user };
    isUpdateModalShown.value = true;
}
</script>

<style scoped>

</style>