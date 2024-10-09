<template>
    <div id="login">
      <h2>Login</h2>
      <form @submit.prevent="loginUser">
        <div class="form-group">
          <label for="username">Username:</label>
          <input type="text" id="username" v-model="user.username" required>
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="user.password" required>
        </div>
        <button type="submit" class="btn">Login</button>
        <span v-if="error" class="warning">{{ errorMessage }}</span>
      </form>
    </div>
  </template>

<script setup>
import router from '@/router';
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const rouetr = useRouter();
const user = ref({
    username:'',
    password:''
});
const error = ref(false);
const errorMessage = ref('');
const role = ref('');

async function loginUser() {
  try {
    const response = await axios.post('http://localhost:3000/users/login', user.value);
    const { token, role } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    router.push('/');
  } catch (err) {
    error.value = true;
    if (err.response && err.response.status === 401) {
      errorMessage.value = 'Invalid username or password';
    } else {
      errorMessage.value = 'An error occurred. Please try again.';
    }
  }
}
</script>

<style scoped>
#login {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.warning {
  color: red;
  font-size: 14px;
  margin-top: 5px;
}

.btn {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #0056b3;
}
</style>