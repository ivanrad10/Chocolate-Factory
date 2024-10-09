<template>
    <form @submit="createFlight($event)">
        <table>
            <tr>
                <td>Polaziste</td>
                <td>
                    <input type="text" v-model="selectedFlight.pol">
                </td>
            </tr>
            <tr>
                <td>Odrediste</td>
                <td>
                    <input type="text" v-model="selectedFlight.odr">
                </td>
            </tr>
            <tr>
                <td>Cena</td>
                <td>
                    <input type="text" v-model="selectedFlight.cena">
                </td>
            </tr>
            <tr>
                <td><input type="submit" value="Dodaj"></td>
            </tr>
            <p>{{ error }}</p>
        </table>
    </form>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const flights = ref([]);
const selectedFlight = ref({pol:"", odr:"", cena:0});
const router = useRouter();
const error = ref("");


function createFlight(event){
    this.error = "";
    if(!selectedFlight.value.cena){
        event.preventDefault();
        this.error="Unesite cenu!";
        return;
    }
    axios.post('http://localhost:8080/WebShopAppREST/rest/flights/', this.selectedFlight).then((response)=>{
        alert('Uspesno dodat');
        this.flights.push(response.data);
    })
    event.preventDefault();
    router.push('/all');
    return;
}

</script>