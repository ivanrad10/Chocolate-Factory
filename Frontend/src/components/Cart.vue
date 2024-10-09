<template>
    <div>
      <h1>Your Cart</h1>
      <div v-if="cart">
        <div v-for="chocolate in chocolates" :key="chocolate.id" class="chocolate-item">
          <img :src="chocolate.image" alt="Chocolate Image" />
          <h2>{{ chocolate.name }}</h2>
          <p>Price: ${{ chocolate.price }}</p>
        <div class="quantity-control">
          <button @click="decrementQuantity(chocolate)">-</button>
          <span>{{ chocolate.quantity }}</span>
          <button @click="incrementQuantity(chocolate)">+</button>
          <button @click="removeFromCart(chocolate.id)">Remove</button>
        </div>
          <p>{{ chocolate.description }}</p>
        </div>
        <div class="total-price">
          <h2>Total Price: ${{ parseFloat(totalPrice).toFixed(2) }}</h2>
        </div>
        <button @click="preparePurhcase">Purchase</button>
      </div>
      <div v-else>
        <p>Loading cart...</p>
      </div>
    </div>
  </template>
  
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const cart = ref(null);
const totalPrice = ref(0);
const chocolates = ref([]);
const availableChocolates = ref([]);
const username = ref('');
const user = ref({
  id: 0,
  username: "",
  password: "",
  name: "",
  lastname: "",
  gender: "",
  birthDate: "",
  role: "",
  purchases: [],
  cart: "",
  factory: "",
  points: 0,
  customerType: ""
})
const newPurchase = ref({
  chocolates: [],
  factoryId: 0,
  customerName: "",
  status: ""
});

onMounted(() => {
  loadCart();
});

onUnmounted(() => {
  localStorage.removeItem('cart');
})

async function loadCart() {
  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/login');
    return;
  }

  try {
      const { data: tokenData } = await axios.post('http://localhost:3000/users/verifyToken', { token });
      username.value = tokenData.username;
      const { data: userCart } = await axios.get(`http://localhost:3000/carts/` + username.value);
      cart.value = userCart;
      chocolates.value = userCart.chocolates;
      totalPrice.value = userCart.totalPrice;
      const{data: allChocolates} = await axios.get('http://localhost:3000/chocolates');
      availableChocolates.value = allChocolates;
  } catch (error) {
    console.error(error);
    localStorage.clear();
    router.push('/login');
  }
}

function incrementQuantity(chocolate) {
  const availableQuantity = availableChocolates.value.find(choc => choc.id === chocolate.id).quantity;
  if(chocolate.quantity >= availableQuantity){
    alert('Cannot add more than available quantity.');
    return;
  }
  chocolate.quantity++;
  updateCart(chocolate);
}

function decrementQuantity(chocolate) {
  if (chocolate.quantity > 1) {
    chocolate.quantity--;
    updateCart(chocolate);
  }
}

function updateCart(chocolate) {
  const quantity = chocolate.quantity;

  axios.patch('http://localhost:3000/carts/' + username.value + '/chocolates/' + chocolate.id, { quantity })
    .then(response => {
      cart.value = response.data;
      chocolates.value = cart.value.chocolates;
      totalPrice.value = cart.value.totalPrice;
    })
    .catch(error => {
      console.error('Error updating cart:', error);
    });
}

function removeFromCart(chocolateId) {
  axios.delete(`http://localhost:3000/carts/` + username.value + `/chocolates/` + chocolateId)
    .then(response =>{
      cart.value = response.data;
      chocolates.value = cart.value.chocolates;
      totalPrice.value = cart.value.totalPrice;
    })
    .catch (error => {
    console.error('Error removing from cart:', error);
  });
}

async function preparePurhcase(){
  try{
    newPurchase.value.chocolates = cart.value.chocolates;
    newPurchase.value.factoryId = localStorage.getItem('cart');
    const customerName = await getCustomerName();
    newPurchase.value.customerName = customerName;
    newPurchase.value.status = "Processing";

    createPurchase()
  } catch(error){
    console.error('Error preparing a purchase: ', error);
  }
}

async function createPurchase() {
  try {
    const response = await axios.post(`http://localhost:3000/purchases`, newPurchase.value);
    const purchase = response.data.purchase;
    await updateUser(purchase);
    await deleteCart();
    alert('Successfully finished a purchase.');
    router.push('/');
  } catch (error) {
    console.error('Error creating a purchase: ', error);
  }
}

async function getUser(){
  try{
    const response = await axios.get('http://localhost:3000/users/' + username.value);
    user.value = response.data;
  } catch(error){
    console.error('Error getting a user: ', error);
  }
}

async function updateUser(purchase){
  try{
    await getUser();
    user.value.points += purchase.totalPrice*133/1000;
    console.log(user.value.points);
    console.log(user.value.id);
    user.value.purchases = [];
    user.value.purchases.push(purchase.id);
    console.log(user.value.purchases);
    await axios.patch('http://localhost:3000/users/' + user.value.id, user.value);
    console.log('User updated successfully');
  } catch(error){
    console.error('Error updating a user: ', error);
  }
}

async function getCustomerName(){
  try {
    const response = await axios.get('http://localhost:3000/users/' + username.value);
    const name = response.data.name;
    const lastname = response.data.lastname;
    return `${name} ${lastname}`;
  } catch (error) {
    console.error('Error finding a user:', error);
    return '';
  }
}

async function deleteCart() {
  try {
    await axios.delete('http://localhost:3000/carts/' + username.value);
    console.log('Cart deleted successfully');
  } catch (error) {
    console.error('Error deleting cart:', error);
  }
}
</script>
  
<style scoped>
.chocolate-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  margin: 8px 0;
  display: flex;
  align-items: center;
  gap: 16px;
}

.chocolate-item img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.quantity-control button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.quantity-control button:hover {
  background-color: #0056b3;
}

.total-price {
  border-top: 1px solid #ddd;
  padding-top: 16px;
  margin-top: 16px;
}
</style>