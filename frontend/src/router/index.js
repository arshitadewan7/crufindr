import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import Dashboard from '../pages/Dashboard.vue'
import Profile from '../pages/Profile.vue'
import Onboarding from '../pages/Onboarding.vue'
import { supabase } from '../services/supabase'
import { MotionPlugin } from '@motionone/vue'

const routes = [
  { path: '/', redirect: '/register' },
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/profile', component: Profile, meta: { requiresAuth: true } },
  { path: '/onboarding', component: Onboarding, meta: { requiresAuth: true } },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

// ✅ Route Guard: Prevents access to dashboard, profile, onboarding if not logged in
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const { data } = await supabase.auth.getUser()
    if (!data.user) {
      return next('/login')
    }
  }
  next()
})

app.use(MotionPlugin)
