<template>
	<div id="web-shop">
		<h1>Table</h1>
		<div id="products">

		<table id="tabela" border="1">
            <thead>
                <tr>
                    <th></th>
                    <th>Naziv</th>
                    <th>Cena</th>
                </tr>
            </thead>
            <tr v-for="p in products">
                        <td>{{ p.id }}</td>
                        <td>{{ p.name }}</td>
                        <td>{{ p.price }}</td>
                    </tr>
        </table>

        <p>{{ queryName }}</p>

        
        <div>
            <RouterLink to="/">Tabela</RouterLink>
        </div>
        </div>
	</div>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';


const router = useRouter();
const products = ref([]);
const queryName = router.currentRoute.value.query.name;

onMounted(()=>{
    loadProducts();
})

function loadProducts(){
    axios.get('http://localhost:8080/WebShopAppREST/rest/products/search?name='+queryName).then((response)=>{
        (products.value = response.data);
    })
}

</script>