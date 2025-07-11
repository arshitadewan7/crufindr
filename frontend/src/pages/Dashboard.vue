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
      <h2 class="text-2xl font-semibold mb-6">Welcome to your dashboard 👋</h2>

      <!-- Cofounder Cards -->
      <div v-if="users.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="user in users"
          :key="user.id"
          class="bg-white p-5 rounded shadow hover:shadow-md transition"
        >
          <h3 class="text-xl font-semibold mb-1">{{ user.name }}</h3>
          <p class="text-sm text-gray-500 mb-2">{{ user.role }}</p>
          <p class="text-sm"><strong>Skills:</strong> {{ user.skills }}</p>
          <p class="text-sm text-gray-700 italic mt-2">{{ user.bio || 'No bio yet.' }}</p>
        </div>
      </div>

      <div v-else class="text-gray-600 mt-10">
        <p>Looking for cofounders near you...</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../services/supabase'

const router = useRouter()
const users = ref([])

const handleLogout = async () => {
  await supabase.auth.signOut()
  router.push('/')
}

onMounted(async () => {
  const { data: authData } = await supabase.auth.getUser()
  const currentUserId = authData?.user?.id

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .neq('id', currentUserId)

  if (error) {
    console.error('Error fetching profiles:', error)
  } else {
    users.value = data
  }
})
</script>
