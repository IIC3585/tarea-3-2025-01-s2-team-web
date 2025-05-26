<template>
  <div class="login view-container">
    <div class="card">
      <h2 class="heading">Iniciar sesión</h2>
      <form @submit.prevent="login" class="space-y-4">
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
          Entrar
        </button>
      </form>
      <button 
        @click="goToRegister" 
        class="button button-secondary mt-4"
      >
        ¿No tienes cuenta? Regístrate
      </button>
    </div>
  </div>

  <!-- Error Message Dialog -->
  <Dialog v-model="isOpen" :open="isOpen" class="relative z-10">
    <template #default="{ close }">
      <div class="fixed inset-0 bg-black opacity-30"></div>
      <div class="fixed inset-0 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg overflow-hidden shadow-lg max-w-sm w-full">
          <div class="px-4 py-3 border-b">
            <p class="text-lg font-semibold text-gray-800">Error</p>
          </div>
          <div class="px-4 py-3">
            <p class="text-gray-700">Usuario o contraseña incorrecta</p>
          </div>
          <div class="px-4 py-3 border-t">
            <button 
              @click="setIsOpen(false)" 
              class="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Dialog } from '@headlessui/vue';

const router = useRouter();
const username = ref('');
const password = ref('');
const isOpen = ref(false);

function login() {
  const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
  const user = users.find(
    u => u.username === username.value && u.password === password.value
  );
  if (user) {
    sessionStorage.setItem('user', username.value);
    router.push('/');
  } else {
    isOpen.value = true;
  }
}

function goToRegister() {
  router.push('/register');
}

function setIsOpen(value) {
  isOpen.value = value;
}
</script>

<style>
/* Removed redundant styles and replaced with reusable classes */
</style>