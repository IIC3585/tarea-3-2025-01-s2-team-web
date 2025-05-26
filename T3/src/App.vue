<template>
  <div id="app">
    <h1 class="text-4xl font-bold text-center text-blue-500 py-4">☁️ Cloud.ly ☁️</h1>
    <router-view />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const showHeader = computed(() => route.path !== '/login')
</script>

