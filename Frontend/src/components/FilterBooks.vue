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
            <td>{{ b.house }}</td>
        </tr>
    </table>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const queryHouse = router.currentRoute.value.query.house;
const books = ref([]);

onMounted(()=>{
    loadFilteredBooks();
})

function loadFilteredBooks(){
    axios.get('http://localhost:8080/WebShopAppREST/rest/books/search?house='+queryHouse).then((response)=>{
        books.value = response.data;
    })
}

</script>