<template>
  <div class="favoritos view-container">
    <div class="card w-full max-w-4xl">
      <h2 class="heading">Mis Favoritos</h2>
      <div v-if="favoritosApi.size">
        <ul class="space-y-4">
          <li v-for="(fav, index) in Array.from(favoritosApi)" :key="index" class="border-b pb-4">
            <div class="flex justify-between items-center">
              <span 
                @click="toggleDropdown(fav)" 
                class="text-blue-500 cursor-pointer hover:underline flex items-center"
              >
                {{ fav }}
                <ChevronUpIcon 
                  v-if="dropdowns[fav]" 
                  class="h-5 w-5 ml-2 text-gray-500" 
                />
                <ChevronDownIcon 
                  v-else 
                  class="h-5 w-5 ml-2 text-gray-500" 
                />
              </span>
              <button 
                @click="eliminarFavorito(fav)" 
                class="button button-danger"
              >
                Eliminar
              </button>
            </div>
            <div v-if="dropdowns[fav]" class="mt-6 p-4 bg-gray-50 rounded-lg shadow">
              <div v-if="climaFavorito[fav]?.loading" class="message-info">Cargando clima...</div>
              <div v-else-if="climaFavorito[fav]?.data">
                <div class="flex justify-center">
                  <img :src="climaFavorito[fav].data.current.weather_icons[0]" alt="Ícono del clima" class="mt-4" />
                </div>
                <p class="text-gray-700"><strong>Temperatura:</strong> {{ climaFavorito[fav].data.current.temperature }}°C</p>
                <p class="text-gray-700"><strong>Sensación térmica:</strong> {{ climaFavorito[fav].data.current.feelslike }}°C</p>
                <p class="text-gray-700"><strong>Índice UV:</strong> {{ climaFavorito[fav].data.current.uv_index }}</p>
                <p class="text-gray-700"><strong>Condición:</strong> {{ climaFavorito[fav].data.current.weather_descriptions[0] }}</p>
        
              </div>
              <div v-else-if="climaFavorito[fav]?.error" class="message-error">
                {{ climaFavorito[fav].error }}
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div v-else class="text-gray-600 text-center mt-6">
        <p>No tienes favoritos aún.</p>
      </div>
      <div v-if="mensajeFavorito" class="message-success">{{ mensajeFavorito }}</div>
      <router-link to="/">
        <button 
          class="button button-primary mt-6"
        >
          Volver a Home
        </button>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { deleteFavorito } from '../services/favoritosApi'
import { getWeatherByCity } from '../services/weatherService'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/vue/20/solid'

const router = useRouter()
const user = ref('')
const favoritosApi = ref(new Set())
const mensajeFavorito = ref('')

const dropdowns = ref({})
const climaFavorito = ref({})

onMounted(() => {
  const sessionUser = sessionStorage.getItem('user')
  if (!sessionUser) {
    router.push('/login')
  } else {
    user.value = sessionUser
    const favoritosArray = JSON.parse(sessionStorage.getItem(`favoritosApi_${user.value}`) || '[]')
    favoritosApi.value = new Set(favoritosArray)
  }
})

async function eliminarFavorito(ciudad) {
  try {
    await deleteFavorito(ciudad)
    favoritosApi.value.delete(ciudad)
    sessionStorage.setItem(`favoritosApi_${user.value}`, JSON.stringify([...favoritosApi.value]))
    mensajeFavorito.value = 'Favorito eliminado correctamente'
  } catch (e) {
    mensajeFavorito.value = 'Error al eliminar favorito en el servidor.'
  }
}

async function toggleDropdown(ciudad) {
  dropdowns.value[ciudad] = !dropdowns.value[ciudad]
  if (dropdowns.value[ciudad] && !climaFavorito.value[ciudad]) {
    climaFavorito.value[ciudad] = { loading: true }
    try {
      const data = await getWeatherByCity(ciudad)
      climaFavorito.value[ciudad] = { loading: false, data }
    } catch {
      climaFavorito.value[ciudad] = { loading: false, error: 'No se pudo obtener el clima.' }
    }
  }
}
</script>

<style>
/* Removed redundant styles and replaced with reusable classes */
</style>