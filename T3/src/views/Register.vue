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
  const users = JSON.parse(localStorage.getItem('registeredUsers')) || []
  if (users.some(u => u.username === username.value)) {
    alert('El usuario ya existe')
    return
  }
  users.push({
    username: username.value,
    password: password.value
  })
  localStorage.setItem('registeredUsers', JSON.stringify(users))
  alert('Usuario registrado correctamente')
  router.push('/login')
}

function goToLogin() {
  router.push('/login')
}
</script>