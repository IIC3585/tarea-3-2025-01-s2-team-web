<template>
  <div class="login">
    <h2>Iniciar sesión</h2>
    <form @submit.prevent="login">
      <input v-model="username" placeholder="Usuario" required />
      <input v-model="password" type="password" placeholder="Contraseña" required />
      <button type="submit">Entrar</button>
    </form>
    <button @click="goToRegister">¿No tienes cuenta? Regístrate</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')

function login() {
  const users = JSON.parse(localStorage.getItem('registeredUsers')) || []
  const user = users.find(
    u => u.username === username.value && u.password === password.value
  )
  if (user) {
    sessionStorage.setItem('user', username.value)
    router.push('/')
  } else {
    alert('Usuario o contraseña incorrecta')
  }
}

function goToRegister() {
  router.push('/register')
}
</script>