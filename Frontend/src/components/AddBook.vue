<template>
    <h1>Add book</h1>

    <form @submit="createBook($event)">
        <table>
            <tr>
                <td>*Name</td>
                <td><input type="text" name="name" v-model="book.name"></td>
            </tr>
            <tr>
                <td>*Author</td>
                <td><input type="text" name="author" v-model="book.author"></td>
            </tr>
            <tr>
                <td>*Price</td>
                <td><input type="number" name="price" v-model="book.price"></td>
            </tr>
            <tr>
                <td>*House</td>
                <select v-model="book.house">
                    <option value="Laguna">Laguna</option>
                    <option value="Vulkan">Vulkan</option>
                    <option value="Logos">Logos</option>
                </select>
            </tr>
            <tr>
                <td><input type="submit" value="Dodaj"></td>
            </tr>
        </table>
        <p style="color: red;">{{ error }}</p>
    </form>

</template>

<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const books = ref([]);
const book = ref({name:"", author:"", price:0, home:""});
const router = useRouter();
const error = ref("");

function createBook(event){
    this.error="";
    if(!book.value.name || !book.value.author || !book.value.price || !book.value.house){
        event.preventDefault();
        this.error = "Niste popunili sva polja!";
        return;
    }
    event.preventDefault();
    axios.post('http://localhost:8080/WebShopAppREST/rest/books/', this.book).then((response)=>{
        if(!response.data){
            event.preventDefault();
            alert('Book with this name already exists!');
            return;
        }
        this.books.push(response.data);
        alert('Book added successfully.');
    })
    router.push('/books');
    return;
}

</script>