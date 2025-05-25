
import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Register from '../views/Register.vue'
import Favoritos from '../views/Favoritos.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/favoritos', name: 'Favoritos', component: Favoritos }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
