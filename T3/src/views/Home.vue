<template>
  <div class="home">
    <h1>Bienvenid@ {{ user }}</h1>
    <button @click="logout">Cerrar sesión</button>
    <hr />
    <h2>Clima en tu ubicación actual</h2>
    <Weather />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import Weather from '../components/Weather.vue'

const router = useRouter()
const user = ref('')

onMounted(() => {
  const sessionUser = sessionStorage.getItem('user')
  if (!sessionUser) {
    router.push('/login')
  } else {
    user.value = sessionUser
  }
})

function logout() {
  sessionStorage.clear()
  router.push('/login')
}
</script>
