<template>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Factory Cards</title>
        <link rel="stylesheet" href="styles.css">
    </head>
    <body>
        <div id="header">
            <button class="profile-button" v-if="isLoggedIn" @click="goToProfile">
                <img src="https://cdn-icons-png.flaticon.com/128/1999/1999625.png">
            </button>
            <button class="btn" v-if="!isLoggedIn" @click="goToLogin">Login</button>
            <button class="btn" v-if="!isLoggedIn" @click="goToRegister">Register</button>
            <button class="btn" v-if="isLoggedIn" @click="logout">Logout</button>
        </div>
        <div id="cards-container">
            <div class="card" @click="handleClick(f.id)" v-for="f in factories">
                <div class="card-header">
                    <img :src="f.logo" alt="Factory Logo">
                </div>
                <div class="card-body">
                    <h2>{{ f.name }}</h2>
                    <p><strong>Location:</strong> {{ f.location }}</p>
                    <p><strong>Rating:</strong> {{ f.rating }}</p>
                </div>
            </div>
        </div>
    </body>
</template>

<script setup>
import axios from 'axios';
import {onMounted, ref} from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const factories = ref([]);
const factory = ref({name: "", location: "", logo: "", rating: 0});
const isLoggedIn = ref(false);
const role = ref('');
const username = ref('')

onMounted(()=>{
    loadFactories();
    checkLoginStatus();
})

function handleClick(factoryId){
    router.push('/factory/' + factoryId);
    
}

function loadFactories(){
    axios.get('http://localhost:3000/factories').then((response)=>{
        factories.value = response.data;
    })
}

function goToProfile() {
    router.push(`/users/${username.value}`)
}

function goToLogin() {
    router.push('/login');
}

function goToRegister() {
    router.push('/register');
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    isLoggedIn.value = false;
    role.value = '';
}

function checkLoginStatus() {
    const token = localStorage.getItem('token');
    if (token) {
        axios.post('http://localhost:3000/users/verifyToken', { token })
            .then(response => {
                isLoggedIn.value = true;
                role.value = response.data.role;
                username.value = response.data.username
            })
            .catch(() => {
                isLoggedIn.value = false;
                role.value = '';
                username.value = '';
                localStorage.removeItem('token');
            });
    } else {
        isLoggedIn.value = false;
        role.value = '';
        username.value = '';
    }
}
</script>

<style scoped>
body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    margin: 0;
    padding: 20px;
}

#header {
    display: flex;
    justify-content: flex-end;
    padding: 10px;
}

.profile-button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    text-align: left;
    margin-right: auto;
}

.profile-button img {
    width: 40px; 
    height: 40px; 
}

.btn {
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    margin-left: 10px;
}

.btn:hover {
    background-color: #0056b3;
}

#cards-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
}

.card {
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    width: 300px;
    height: 300px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s;
    overflow: hidden;
}

.card:hover {
    transform: translateY(-5px);
}

.card-header {
    width: 100%;
    height: 150px;
}

.card-header img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
}

.card-body {
    padding: 20px;
}

.card-body h2 {
    margin: 0 0 20px;
    font-size: 24px;
}

.card-body p {
    margin: 10px 0;
    font-size: 16px;
}

.card-body p.location {
    margin-top: 20px;
}

.card-body p.rating {
    margin-bottom: 20px;
}
</style>