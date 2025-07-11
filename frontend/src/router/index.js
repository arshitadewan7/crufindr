import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/Login.vue'
import Dashboard from '../pages/Dashboard.vue'
import Profile from '../pages/Profile.vue'
import Onboarding from '../pages/Onboarding.vue'

const routes = [
  { path: '/', component: Login },
  { path: '/dashboard', component: Dashboard },
  { path: '/profile', component: Profile },
  { path: '/onboarding', component: Onboarding },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
