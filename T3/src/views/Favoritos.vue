<template>
  <div class="favoritos">
    <h2>Mis Favoritos</h2>
    <div v-if="favoritosApi.length">
      <ul>
        <li v-for="fav in favoritosApi" :key="fav.id">
          {{ fav.ciudad }}
          <button @click="eliminarFavorito(fav.id)">Eliminar</button>
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

const router = useRouter()
const user = ref('')
const favoritosApi = ref([])
const mensajeFavorito = ref('')

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
</script>