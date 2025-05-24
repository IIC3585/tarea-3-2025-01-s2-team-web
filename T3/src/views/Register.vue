<template>
  <div class="register">
    <h2>Crear cuenta</h2>
    <form @submit.prevent="register">
      <input v-model="username" placeholder="Usuario" required />
      <input v-model="password" type="password" placeholder="Contraseña" required />
      <button type="submit">Registrarse</button>
    </form>
    <button @click="goToLogin">¿Ya tienes cuenta? Inicia sesión</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')

function register() {
  // Guardamos usuario en sessionStorage
  sessionStorage.setItem('registeredUser', JSON.stringify({
    username: username.value,
    password: password.value
  }))
  alert('Usuario registrado correctamente')
  router.push('/')
}

function goToLogin() {
  router.push('/login')
}
</script>