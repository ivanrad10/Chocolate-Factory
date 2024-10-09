<template>
    <table border="1">
        <thead>
            <td></td>
            <td>polaziste</td>
            <td>odrediste</td>
            <td>cena</td>
        </thead>
        <tr v-for="f in flights">
            <td>{{ f.sifra }}</td>
            <td>{{ f.pol }}</td>
            <td>{{ f.odr }}</td>
            <td>{{ f.cena }}</td>
        </tr>
    </table>
    <select v-model="selectedOption.odr">
        <option value="kurac">kurac</option>
        <option value="pizda">pizda</option>
    </select>
    <p>{{ selectedOption.odr }}</p>
</template>
<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';

const flights = ref([]);
const odredista = ref([]);
const selectedOption = ref({ sifra: "", pol: "", odr:"", cena:0 });

onMounted(()=>{
    loadData();
})

function loadData(){
    axios.get('http://localhost:8080/WebShopAppREST/rest/flights/').then((response)=>{
        (flights.value = response.data);
    })
    const destinations = new Set();
    flights.value.forEach(flight => {
        destinations.add(flight.odr);
    });
    odredista.value = Array.from(destinations);
}

</script>