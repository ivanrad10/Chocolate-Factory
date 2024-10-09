<template>
    <div id="register">
        <h2>Register</h2>
        <form @submit.prevent="registerUser">
            <div class="form-group">
                <label for="username">Username:</label>
                <input type="text" id="username" v-model="newUser.username" @blur="checkUsername" required>
                <span v-if="usernameExists" class="warning">Username already exists.</span>
            </div>
            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" id="password" v-model="newUser.password" required>
            </div>
            <div class="form-group">
                <label for="confirmPassword">Confirm Password:</label>
                <input type="password" id="confirmPassword" v-model="confirmPassword" @input="checkPasswordMatch" required>
                <span v-if="!passwordsMatch" class="warning">Passwords do not match.</span>
            </div>
            <div class="form-group">
                <label for="name">Name:</label>
                <input type="text" id="name" v-model="newUser.name" required>
            </div>
            <div class="form-group">
                <label for="lastname">Lastname:</label>
                <input type="text" id="lastname" v-model="newUser.lastname" required>
            </div>
            <div class="form-group">
                <label for="gender">Gender:</label>
                <select v-model="newUser.gender" required>
                    <option value="male">male</option>
                    <option value="female">female</option>
                </select>
            </div>
            <div class="form-group">
                <label for="birthDate">Birthdate:</label>
                <input type="text" id="birthDate" v-model="newUser.birthDate" required>
            </div>
            <button type="submit" class="btn" :disabled="usernameExists || !passwordsMatch">Register</button>
        </form>
    </div>
</template>

<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const newUser = ref({
    username:'',
    password:'',
    name:'',
    lastname:'',
    gender:'',
    birthDate:'',
    role:'',
    purchases: '',
    cart: '',
    factory: '',
    points: 0,
    customerType: ''
});
const confirmPassword = ref('');
const usernameExists = ref(false);
const passwordsMatch = ref(true);

function checkUsername() {
  if (newUser.value.username) {
    axios.get(`http://localhost:3000/users/check/` + newUser.value.username)
      .then(response => {
        usernameExists.value = false;
      })
      .catch(error => {
        if (error.response.status === 409) {
          usernameExists.value = true;
        } else {
          console.error(error);
        }
      });
  }
}

function registerUser(){
    if (!passwordsMatch.value) {
        alert('Passwords do not match');
        return;
    }
    newUser.value.role = "customer";
    axios.post('http://localhost:3000/users', newUser.value)
    .then(response => {
      alert('Registration successful!');
      router.push('/login');
    })
    .catch(error => {
      if (error.response.status === 409) {
        usernameExists.value = true;
      } else {
        alert('Registration failed. Please try again.');
        console.error(error);
      }
    });
}

function checkPasswordMatch() {
  passwordsMatch.value = newUser.value.password === confirmPassword.value;
}
</script>

<style scoped>
#register {
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
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.btn:hover:not(:disabled) {
  background-color: #218838;
}
</style>