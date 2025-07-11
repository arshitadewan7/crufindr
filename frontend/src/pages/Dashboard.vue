<template>
  <div class="min-h-screen bg-gray-50 text-gray-800">
    <!-- Top Navigation -->
    <header class="bg-white shadow p-4 flex justify-between items-center">
      <h1 class="text-xl font-bold text-indigo-600">Crufindr</h1>
      <button
        @click="handleLogout"
        class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
      >
        Logout
      </button>
    </header>

    <!-- Content -->
    <main class="p-6">
      <h2 class="text-2xl font-semibold mb-4">Welcome to your dashboard 👋</h2>

      <!-- Placeholder for future components -->
      <div class="border-2 border-dashed border-indigo-300 rounded-xl p-6 bg-white shadow-md">
        <p class="text-gray-600">
          This is your dashboard. You’ll soon see cofounder matches, notifications, and your profile here.
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { supabase } from '../services/supabase'

const router = useRouter()

const handleLogout = async () => {
  await supabase.auth.signOut()
  router.push('/')
}
</script>
