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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { deleteFavorito } from '../services/favoritosApi'

const favoritosApi = ref(JSON.parse(sessionStorage.getItem('favoritosApi') || '[]'))
const mensajeFavorito = ref('')

async function eliminarFavorito(id) {
  try {
    await deleteFavorito(id)
    favoritosApi.value = favoritosApi.value.filter(f => f.id !== id)
    sessionStorage.setItem('favoritosApi', JSON.stringify(favoritosApi.value))
    mensajeFavorito.value = 'Favorito eliminado correctamente'
  } catch (e) {
    mensajeFavorito.value = 'Error al eliminar favorito en el servidor.'
  }
}
</script>