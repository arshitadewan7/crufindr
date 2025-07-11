<template>
  <div>
    <h2>Welcome to Crufindr Dashboard</h2>
    <button @click="logout">Logout</button>
  </div>
</template>

<script setup>
import { supabase } from '../services/supabase'
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = async () => {
  await supabase.auth.signOut()
  router.push('/')
}
</script>
