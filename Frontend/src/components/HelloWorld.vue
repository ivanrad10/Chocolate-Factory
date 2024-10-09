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
          <td>
            <router-link :to="'/tabela?name='+p.name">{{ p.name }}</router-link>
          </td>
					<td>{{ p.price }}</td>
				</tr>
			</table>
      <form @submit="createProduct($event)">
        <table>
          <tr>
            <td>Naziv</td>
            <td><input type="text" name="name" v-model="selectedProduct.name"></td>
          </tr>
          <tr>
            <td>Cena</td>
            <td><input type="number" name="price" v-model="selectedProduct.price"></td>
          </tr>
          <tr>
            <td><input type="submit" value="Posalji"></td>
          </tr>
        </table>
      </form>
      <form @submit="deleteProduct($event)">
        <table>
          <tr>
            <td>Unesite id</td>
            <td><input type="text" name="id" v-model="selectedProduct.id"></td>
          </tr>
          <tr>
            <td><input type="submit" value="Obrisi"></td>
          </tr>
        </table>
      </form>

      
      <div>
        <RouterLink to="/tabela">Tabela</RouterLink>
      </div>
		</div>
	</div>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const products = ref([]);
const selectedProduct = ref({ name: "", price: 0 });
const router = useRouter();

onMounted(()=>{
  loadProducts();
})

function loadProducts(){
  axios.get('http://localhost:8080/WebShopAppREST/rest/products/').then(response=>{
    (products.value = response.data)
  });
}


function createProduct(event){
  if(!this.selectedProduct.name || !this.selectedProduct.price){
    alert('kurcina')
    event.preventDefault();
    return;
  }
  event.preventDefault();
  console.log(this.selectedProduct)
  axios.post('http://localhost:8080/WebShopAppREST/rest/products/', this.selectedProduct).then((response)=>{
    if(!response.data){
      alert('Knjiga sa ovim imenom')
    }
    alert('Proizvod uspesno dodat')
    this.products.push(response.data)
  })
}

function deleteProduct(event){
  const id = selectedProduct.value.id
  if (!id) {
    alert('Polje je prazno');
		event.preventDefault();
		return;
	}
  event.preventDefault();
  console.log(this.selectedProduct)
  axios.delete('http://localhost:8080/WebShopAppREST/rest/products/'+id).then((response)=>{
    alert('Proizvod uspesno izbrisan');
    loadProducts();
  })
  router.push('/tabela');
}

</script>
<style scoped>
.invalid {
  background-color: red;
}
</style>