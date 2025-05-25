<template>
  <div class="home">
    <h1>Bienvenid@ {{ user }}</h1>
    <button @click="logout">Cerrar sesión</button>
    <hr />
    <h2>Clima en tu ubicación actual</h2>
    <Weather />
  </div>

  <hr />
    <h2>Buscar clima por ciudad</h2>
    <form @submit.prevent="buscarClima">
      <input v-model="ciudad" placeholder="Ingresa una ciudad" required />
      <button type="submit">Buscar</button>
    </form>
    <div v-if="loadingBusqueda">Buscando clima...</div>
    <div v-if="climaBusqueda">
      <p><strong>Ubicación:</strong> {{ climaBusqueda.location.name }}, {{ climaBusqueda.location.country }}</p>
      <p><strong>Temperatura:</strong> {{ climaBusqueda.current.temperature }}°C</p>
      <p><strong>Sensación térmica:</strong> {{ climaBusqueda.current.feelslike }}°C</p>
      <p><strong>Índice UV:</strong> {{ climaBusqueda.current.uv_index }}</p>
      <p><strong>Condición:</strong> {{ climaBusqueda.current.weather_descriptions[0] }}</p>
      <img :src="climaBusqueda.current.weather_icons[0]" alt="Ícono del clima" />
      <button @click="agregarAFavoritos">Agregar ciudad a favoritos</button>
    </div>
    <div v-if="errorBusqueda" style="color:red;">{{ errorBusqueda }}</div>
    <router-link to="/favoritos">
      <button>Ver mis favoritos</button>
    </router-link>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import Weather from '../components/Weather.vue'
import { getWeatherByCity } from '../services/weatherService'
import { postFavorito, deleteFavorito } from '../services/favoritosApi'

const router = useRouter()
const user = ref('')

const ciudad = ref('')
const climaBusqueda = ref(null)
const loadingBusqueda = ref(false)
const errorBusqueda = ref('')
const mensajeFavorito = ref('')

const favoritosApi = ref(JSON.parse(sessionStorage.getItem('favoritosApi') || '[]'))

onMounted(() => {
  const sessionUser = sessionStorage.getItem('user')
  if (!sessionUser) {
    router.push('/login')
  } else {
    user.value = sessionUser
  }
})

function logout() {
  sessionStorage.removeItem('user')
  router.push('/login')
}

async function buscarClima() {
  climaBusqueda.value = null
  errorBusqueda.value = ''
  loadingBusqueda.value = true
  try {
    const data = await getWeatherByCity(ciudad.value)
    if (data.success === false) {
      errorBusqueda.value = 'No se encontró la ciudad o hubo un error en la búsqueda.'
    } else {
      climaBusqueda.value = data
    }
  } catch (e) {
    errorBusqueda.value = 'Error al buscar el clima.'
  } finally {
    loadingBusqueda.value = false
  }
}

async function agregarAFavoritos() {
  if (climaBusqueda.value) {
    try {
      const res = await postFavorito(climaBusqueda.value.location.name)
      favoritosApi.value.push({ id: res.id, ciudad: climaBusqueda.value.location.name })
      sessionStorage.setItem('favoritosApi', JSON.stringify(favoritosApi.value)) // <-- Agrega esto
      mensajeFavorito.value = '¡Ciudad agregada a favoritos (POST exitoso)!'
    } catch (e) {
      mensajeFavorito.value = 'Error al guardar favorito en el servidor.'
    }
  }
}

async function eliminarFavorito(id) {
  try {
    await deleteFavorito(id)
    favoritosApi.value = favoritosApi.value.filter(f => f.id !== id)
  } catch (e) {
    mensajeFavorito.value = 'Error al eliminar favorito en el servidor.'
  }
}
</script>
