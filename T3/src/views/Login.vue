<template>
  <div class="login">
    <h2>Iniciar sesión</h2>
    <form @submit.prevent="login">
      <input v-model="username" placeholder="Usuario" required />
      <input v-model="password" type="password" placeholder="Contraseña" required />
      <button type="submit">Entrar</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')

function login() {
  if (username.value === 'admin' && password.value === '1234') {
    sessionStorage.setItem('user', username.value)
    router.push('/')
  } else {
    alert('Usuario o contraseña incorrecta')
  }
}
</script>
