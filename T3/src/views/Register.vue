<template>
  <div class="register view-container">
    <div class="card">
      <h2 class="heading">Crear cuenta</h2>
      <form @submit.prevent="register" class="space-y-4">
        <input 
          v-model="username" 
          placeholder="Usuario" 
          required 
          class="input"
        />
        <input 
          v-model="password" 
          type="password" 
          placeholder="Contraseña" 
          required 
          class="input"
        />
        <button 
          type="submit" 
          class="button button-primary"
        >
          Registrarse
        </button>
      </form>
      <button 
        @click="goToLogin" 
        class="button button-secondary mt-4"
      >
        ¿Ya tienes cuenta? Inicia sesión
      </button>
    </div>
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

<style>
/* Removed redundant styles and replaced with reusable classes */
</style>