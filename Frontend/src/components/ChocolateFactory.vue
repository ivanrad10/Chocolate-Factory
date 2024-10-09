<template>
    <!-- Factory Info -->
  <div class="factory-details">
    <button class="btn cart-btn" v-if="role === 'customer'" @click="goToCart">Cart</button>
    <div class="factory-header">
      <img :src="factory.logo" alt="Factory Logo" class="factory-logo">
      <h1 class="factory-name">{{ factory.name }}</h1>
    </div>
    <div class="factory-body">
      <p><strong>Working Hours:</strong> {{ factory.workingHours }}</p>
      <p><strong>Status:</strong> {{ factory.status }}</p>
      <p><strong>Location:</strong> {{ factory.location }}</p>
      <p><strong>Rating:</strong> {{ factory.rating }}</p>
    </div>
    <!-- All Chocolates -->
    <div class="chocolates-section">
      <h2>Chocolates</h2>
      <div class="chocolates-header" v-if="role === 'manager'">
        <button @click="isAddModalShown = true" class="add-chocolate-button">Add Chocolate</button>
      </div>
      <div class="chocolates-container">
        <div class="chocolate-card" v-for="choc in filteredChocolates" :key="choc.id">
          <img :src="choc.image" alt="Chocolate Image" class="chocolate-image">
          <div class="chocolate-info">
            <h3>{{ choc.name }}</h3>
            <p><strong>Price:</strong> ${{ choc.price }}</p>
            <div v-if="role === 'manager'">
              <button @click="deleteChocolate(choc.id)" class="delete-chocolate-button">
                  <font-awesome-icon :icon="faTrashAlt" />
              </button>
              <button @click="updateChocolateModal(choc)" class="update-chocolate-button">Update</button>
            </div>
            <div v-else-if="role === 'customer'" class="quantity-controls">
              <div></div>
              <button @click="decrementQuantity(choc)" class="quantity-button">-</button>
              <input type="number" v-model.number="choc.selectedQuantity" min="1" :max="choc.quantity" class="quantity-input">
              <button @click="incrementQuantity(choc)" class="quantity-button">+</button>
              <button @click="addToCart(choc, choc.selectedQuantity)" class="add-to-cart-button">
                <font-awesome-icon :icon="faCartPlus"/> Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Add Chocolate -->
    <div class="modal" v-if="isAddModalShown">
      <div class="modal-content">
        <span class="close" @click="isAddModalShown = false">&times;</span>
        <h2>Add Chocolate</h2>
        <form @submit.prevent="addChocolate">
          <div class="form-group">
            <label for="name">Name:</label>
            <input type="text" v-model="newChocolate.name" required>
          </div>
          <div class="form-group">
            <label for="price">Price:</label>
            <input type="number" v-model="newChocolate.price" required>
          </div>
          <div class="form-group">
            <label for="kind">Kind:</label>
            <input type="text" v-model="newChocolate.kind" required>
          </div>
          <div class="form-group">
            <label for="type">Type:</label>
            <input type="text" v-model="newChocolate.type" required>
          </div>
          <div class="form-group">
            <label for="weight">Wight:</label>
            <input type="number" v-model="newChocolate.weight" required>
          </div>
          <div class="form-group">
            <label for="description">Description:</label>
            <input type="text" v-model="newChocolate.description" required>
          </div>
          <div class="form-group">
            <label for="image">Image(address):</label>
            <input type="text" v-model="newChocolate.image" required>
          </div>
          <button type="submit" class="submit-button">Submit</button>
        </form>
      </div>
    </div>
    <!-- Update Chocolate -->
    <div class="modal" v-if="isUpdateModalShown">
        <div class="modal-content">
        <span class="close" @click="isUpdateModalShown = false">&times;</span>
        <h2>Update Chocolate</h2>
        <form @submit.prevent="updateChocolate">
          <div class="form-group">
            <label for="name">Quantity:</label>
            <input type="number" v-model="updatedChocolate.quantity" required>
          </div>
          <div class="form-group">
            <label for="price">Price:</label>
            <input type="number" v-model="updatedChocolate.price" required>
          </div>
          <div class="form-group">
            <label for="name">Name:</label>
            <input type="text" v-model="updatedChocolate.name" required>
          </div>
          <div class="form-group">
            <label for="kind">Kind:</label>
            <input type="text" v-model="updatedChocolate.kind" required>
          </div>
          <div class="form-group">
            <label for="type">Type:</label>
            <input type="text" v-model="updatedChocolate.type" required>
          </div>
          <div class="form-group">
            <label for="weight">Wight:</label>
            <input type="number" v-model="updatedChocolate.weight" required>
          </div>
          <div class="form-group">
            <label for="description">Description:</label>
            <input type="text" v-model="updatedChocolate.description" required>
          </div>
          <div class="form-group">
            <label for="image">Image(address):</label>
            <input type="text" v-model="updatedChocolate.image" required>
          </div>
            <button type="submit" class="submit-button">Submit</button>
        </form>
        </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrashAlt, faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faTrashAlt, faCartPlus);

const route = useRoute();
const router = useRouter();
const factory = ref({name: "", workingHours: "", status: "", location: "", rating: 0});
const id = route.params.id;
const chocolates = ref([]);
const newChocolate = ref({
  name: "",
  price: 0,
  kind: "",
  factoryId: 0,
  type: "",
  weight: 0,
  description: "",
  image: "",
  status: "Out of stock",
  quantity: 0
});
const updatedChocolate = ref({});
const isAddModalShown = ref(false);
const isUpdateModalShown = ref(false);
const role = ref('');
const username = ref('');

let pollInterval = null;
let pollTimeout = null;

onMounted(()=>{
    checkUser();
    loadFactory();
    loadChocolates();
    startPolling();
});

onUnmounted(() => {
  stopPolling();
  if(username.value){
    deleteCart();
  }
});

const filteredChocolates = computed(() => {
  if(role.value === 'manager'){
    return chocolates.value;
  } else{
    return chocolates.value.filter(choc => choc.status === 'In stock');
  }
});

function checkUser() {
  const token = localStorage.getItem('token');
  if (!token) {
    role.value = '';
    username.value = '';
    return;
  }
  getTokenInfo(token);
}

function getTokenInfo(token){
  axios.post('http://localhost:3000/users/verifyToken', { token })
      .then(response => {
        role.value = response.data.role;
        username.value = response.data.username;
        addUserCart();
      })
      .catch(() => {
        role.value = '';
        username.value = '';
      });
}

function addUserCart(){
  if(username.value){
    axios.post('http://localhost:3000/carts', { username: username.value })
      .then(response => {
        return;
      })
      .catch(error => {
        console.error('Error creating cart:', error);
      });
  }
}

function loadFactory(){
    axios.get('http://localhost:3000/factories/' + id).then((response)=>{
        factory.value = response.data;
        loadChocolates();
    });
}

function loadChocolates(){
    axios.get('http://localhost:3000/factories/' + id + "/chocolates").then((response)=>{
      chocolates.value = response.data.map(choc => ({
        ...choc,
        selectedQuantity: 1
      }));
    });
}

function goToCart() {
  localStorage.setItem('cart', id);
  router.push('/cart');
}

function addChocolate() {
    const id = +route.params.id;
    newChocolate.value.factoryId = id;
    axios.post(`http://localhost:3000/chocolates/`, newChocolate.value)
    .then(response => {
        //close modal and reload chocolates
        isAddModalShown.value = false;
        chocolates.value.push(response.data);
        resetNewChocolateForm();
        startPolling();
    })
    .catch(error => {
        console.error("Error adding chocolate:", error);
    });
}

function deleteChocolate(chocolateId){
    axios.delete(`http://localhost:3000/chocolates/` + chocolateId)
    .then(() => {
        chocolates.value = chocolates.value.filter(choc => choc.id !== chocolateId);
        startPolling();
    })
    .catch(error => {
        console.error("Error deleting chocolate:", error);
    });
}

function updateChocolateModal(chocolate){
    updatedChocolate.value = { ...chocolate };
    isUpdateModalShown.value = true;
}

function updateChocolate(){
    if(updatedChocolate.value.quantity === 0){
        updatedChocolate.value.status = "Out of stock"
    } else{
        updatedChocolate.value.status = "In stock"
    }
    axios.patch('http://localhost:3000/chocolates/' + updatedChocolate.value.id,
    updatedChocolate.value).then(response =>{
        const updatedData = response.data;
        const index = chocolates.value.findIndex(choc => choc.id === updatedData.id);
        if(index !== -1){
            chocolates.value[index] = updatedChocolate;
        }
        isUpdateModalShown.value = false;
        startPolling();
    })
    .catch(error => {
        console.error("Error updating chocolate:", error);
    });
}

function incrementQuantity(chocolate) {
  if (chocolate.selectedQuantity < chocolate.quantity) {
    chocolate.selectedQuantity++;
  }
}

function decrementQuantity(chocolate) {
  if (chocolate.selectedQuantity > 1) {
    chocolate.selectedQuantity--;
  }
}

function addToCart(chocolate, quantity) {
  checkQuantityInStock(chocolate, quantity)
  .then(isOutOfStock => {
    if (isOutOfStock) {
      alert('Not enough quantity in stock');
      return;
    } else{
      addChocolateToCart(chocolate, quantity);
    }
  });
}

function addChocolateToCart(chocolate, quantity){
  axios.patch('http://localhost:3000/carts/'+ username.value +'/chocolates/add', {
    chocolate, quantity
  })
  .then(response => {
    alert('Chocolate added to cart');
  })
  .catch(error => {
    console.error('Error adding to cart:', error);
  });
}

function checkQuantityInStock(chocolate, quantity){
  return axios.get('http://localhost:3000/carts/' + username.value)
    .then(response => {
      const cartChocolates = response.data.chocolates;
      const cartChocolate = cartChocolates.find(choc => choc.id === chocolate.id);

      if (cartChocolate) {
        return (chocolate.quantity - cartChocolate.quantity - quantity) < 0;
      } else {
        return (chocolate.quantity - quantity) < 0;
      }
    })
    .catch(error => {
      console.error('Error finding a cart:', error);
      return false;
    });
}

function resetNewChocolateForm() {
  newChocolate.value = {
    name: "",
    price: 0,
    kind: "",
    type: "",
    weight: 0,
    description: "",
    image: ""
  };
}

function deleteCart(){
  if(localStorage.getItem('cart')){
    return;
  }
  axios.delete('http://localhost:3000/carts/' + username.value);
}

function startPolling() {
  if (pollInterval) clearInterval(pollInterval);
  if (pollTimeout) clearTimeout(pollTimeout);

  pollInterval = setInterval(() => {
    loadChocolates();
  }, 500);

  pollTimeout = setTimeout(() => {
    stopPolling();
  }, 500);
}

function stopPolling() {
  if (pollInterval) {
    clearInterval(pollInterval);
    pollInterval = null;
  }
  if (pollTimeout) {
    clearTimeout(pollTimeout);
    pollTimeout = null;
  }
}

</script>

<style scoped>
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

.cart-btn {
  position: absolute;
  top: 20px;
  right: 20px;
}

.factory-details {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    margin: auto;
    position: relative;
}

.factory-header {
    text-align: center;
    margin-bottom: 20px;
}

.factory-logo {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 50%;
    margin-bottom: 20px;
}

.factory-name {
    font-size: 32px;
    margin: 0;
}

.factory-body {
    font-size: 18px;
}

.factory-body p {
    margin: 10px 0;
}

.factory-body strong {
    display: inline-block;
    width: 150px;
}

.chocolates-section {
    margin-top: 40px;
}

.chocolates-section h2 {
    text-align: center;
    margin-bottom: 20px;
}

.chocolates-header {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.quantity-button {
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 10px;
}

.quantity-input {
  width: 30px;
  text-align: center;
  margin: 0 5px;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.add-to-cart-button {
  background-color: green;
  color: #fff;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 8px;
  margin: 10px;
  display: flex;
  align-items: center;
}

.add-to-cart-button:hover {
  background-color: #0056b3;
}

.add-to-cart-button font-awesome-icon {
  margin: 10px;
}

.add-chocolate-button {
    padding: 10px 20px;
    font-size: 16px;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.add-chocolate-button:hover {
    background-color: #0056b3;
}

.chocolates-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
}

.chocolate-card {
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    width: 200px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.3s;
    position: relative;
}

.chocolate-card:hover {
    transform: translateY(-5px);
}

.chocolate-image {
    width: 100%;
    height: 150px;
    object-fit: cover;
}

.chocolate-info {
    padding: 10px;
    text-align: center;
}

.chocolate-info h3 {
    font-size: 20px;
    margin: 10px 0;
}

.chocolate-info p {
    margin: 0;
    font-size: 16px;
}

.modal {
  display: block; /* show */
  position: fixed;
  z-index: 1; /* on top od other content */
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto; /* scroll */
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 2% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 30%;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.submit-button {
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #0056b3;
}

.delete-chocolate-button {
  border: none;
  background-color: #dc3545;
  color: white;
  border-radius: 50%;
  padding: 5px;
  font-size: 16px;
  cursor: pointer;
  position: absolute;
  top: 5px;
  right: 5px;
  display: none;
}

.delete-chocolate-button:hover {
  background-color: #c82333;
}

.chocolate-card:hover .delete-chocolate-button {
  display: block;
}

.update-chocolate-button {
  padding: 5px 10px;
  font-size: 14px;
  color: #fff;
  background-color: #ffc107;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.update-chocolate-button:hover {
  background-color: #e0a800;
}

</style>