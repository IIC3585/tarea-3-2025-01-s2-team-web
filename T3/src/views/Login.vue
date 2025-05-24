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
  // Verificamos si el usuario registrado está en sessionStorage
  const regUser = JSON.parse(sessionStorage.getItem('registeredUser'))
  if (
    regUser &&
    username.value === regUser.username &&
    password.value === regUser.password
  ) {
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