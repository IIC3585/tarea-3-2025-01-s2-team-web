<template>
  <div>
    <h1>Bienvenido {{ user }}</h1>
    <button @click="logout">Cerrar sesión</button>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

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
