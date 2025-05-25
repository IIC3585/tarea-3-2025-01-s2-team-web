<template>
  <div class="weather">
    <div v-if="loading">Cargando clima...</div>
    <div v-else-if="weather">
      <p><strong>Ubicación:</strong> {{ weather.location.name }}, {{ weather.location.country }}</p>
      <p><strong>Temperatura:</strong> {{ weather.current.temperature }}°C</p>
      <p><strong>Condición:</strong> {{ weather.current.weather_descriptions[0] }}</p>
      <img :src="weather.current.weather_icons[0]" alt="Ícono del clima" />
    </div>
    <div v-else>
      <p>No se pudo obtener el clima. ¿Tienes permisos de geolocalización activados?</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getWeatherByCoords } from '../services/weatherService'

const weather = ref(null)
const loading = ref(true)   

onMounted(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude
      const lon = position.coords.longitude

      try {
        const data = await getWeatherByCoords(lat, lon)
        weather.value = data
        console.log('Datos del clima:', weather.value)
      } catch (error) {
        console.error('Error al obtener el clima:', error)
      } finally {
        loading.value = false
      }
    }, (err) => {
      console.error('Error con geolocalización:', err)
      loading.value = false
    })
  } else {
    alert('Geolocalización no soportada por este navegador.')
    loading.value = false
  }
})
</script>
