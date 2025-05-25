<template>
  <div class="favoritos">
    <h2>Mis Favoritos</h2>
    <div v-if="favoritosApi.length">
      <ul>
        <li v-for="fav in favoritosApi" :key="fav.id">
          <span @click="toggleDropdown(fav)" style="cursor:pointer; color:blue; text-decoration:underline;">
            {{ fav.ciudad }}
          </span>
          <button @click="eliminarFavorito(fav.id)">Eliminar</button>
          <div v-if="dropdowns[fav.id]" style="margin-left: 1em; border: 1px solid #ccc; padding: 0.5em;">
            <div v-if="climaFavorito[fav.id]?.loading">Cargando clima...</div>
            <div v-else-if="climaFavorito[fav.id]?.data">
              <strong>Temperatura:</strong> {{ climaFavorito[fav.id].data.current.temperature }}°C<br>
              <strong>Condición:</strong> {{ climaFavorito[fav.id].data.current.weather_descriptions[0] }}<br>
              <img :src="climaFavorito[fav.id].data.current.weather_icons[0]" alt="Ícono del clima" />
            </div>
            <div v-else-if="climaFavorito[fav.id]?.error" style="color:red;">
              {{ climaFavorito[fav.id].error }}
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>No tienes favoritos aún.</p>
    </div>
    <div v-if="mensajeFavorito" style="color:green;">{{ mensajeFavorito }}</div>
    <router-link to="/">
      <button>Volver a Home</button>
    </router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { deleteFavorito } from '../services/favoritosApi'
import { getWeatherByCity } from '../services/weatherService'

const router = useRouter()
const user = ref('')
const favoritosApi = ref([])
const mensajeFavorito = ref('')

const dropdowns = ref({})
const climaFavorito = ref({})

onMounted(() => {
  const sessionUser = sessionStorage.getItem('user')
  if (!sessionUser) {
    router.push('/login')
  } else {
    user.value = sessionUser
    favoritosApi.value = JSON.parse(sessionStorage.getItem(`favoritosApi_${user.value}`) || '[]')
  }
})

async function eliminarFavorito(id) {
  try {
    await deleteFavorito(id)
    favoritosApi.value = favoritosApi.value.filter(f => f.id !== id)
    sessionStorage.setItem(`favoritosApi_${user.value}`, JSON.stringify(favoritosApi.value))
    mensajeFavorito.value = 'Favorito eliminado correctamente'
  } catch (e) {
    mensajeFavorito.value = 'Error al eliminar favorito en el servidor.'
  }
}

async function toggleDropdown(fav) {
  dropdowns.value[fav.id] = !dropdowns.value[fav.id]
  if (dropdowns.value[fav.id] && !climaFavorito.value[fav.id]) {
    climaFavorito.value[fav.id] = { loading: true }
    try {
      const data = await getWeatherByCity(fav.ciudad)
      climaFavorito.value[fav.id] = { loading: false, data }
    } catch {
      climaFavorito.value[fav.id] = { loading: false, error: 'No se pudo obtener el clima.' }
    }
  }
}
</script>