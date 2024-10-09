<template>
    <table border="1">
        <thead>
            <td>Name</td>
            <td>Author</td>
            <td>Price</td>
            <td>House</td>
        </thead>
        <tr v-for="b in books">
            <td>{{ b.name }}</td>
            <td>{{ b.author }}</td>
            <td>{{ b.price }}</td>
            <td><router-link :to="'/filter?house='+b.house">{{ b.house }}</router-link></td>
        </tr>
    </table>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';

const books = ref([]);
const book = ref({name:"", author:"", price:0, house:""});

onMounted(()=>{
    loadBooks();
})

function loadBooks(){
    axios.get('http://localhost:3000/factories').then((response)=>{
        books.value = response.data;
    })
}

</script>