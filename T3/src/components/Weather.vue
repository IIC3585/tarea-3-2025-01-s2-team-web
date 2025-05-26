<template>
  <div class="weather mt-6 p-4 bg-gray-50 rounded-lg shadow">
    <div v-if="loading" class="text-gray-700">Cargando clima...</div>
    <div v-else-if="weather">
      <p class="text-gray-700 text-xl">{{ weather.location.name }}, {{ weather.location.country }}</p>
      <div class="flex justify-center">
        <img :src="weather.current.weather_icons[0]" alt="Ícono del clima" class="mt-4" />
      </div>
      <p class="text-gray-700"><strong>Temperatura:</strong> {{ weather.current.temperature }}°C</p>
      <p class="text-gray-700"><strong>Sensación térmica:</strong> {{ weather.current.feelslike }}°C</p>
      <p class="text-gray-700"><strong>Condición:</strong> {{ weather.current.weather_descriptions[0] }}</p>
      <p class="text-gray-700"><strong>Índice UV:</strong> {{ weather.current.uv_index }}</p>
    </div>
    <div v-else>
      <p class="text-gray-700">No se pudo obtener el clima. ¿Tienes permisos de geolocalización activados?</p>
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
