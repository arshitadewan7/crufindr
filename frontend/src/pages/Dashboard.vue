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

    <!-- Main Content -->
    <main class="p-6">
      <h2 class="text-2xl font-semibold mb-6">Welcome to your dashboard 👋</h2>

      <!-- Top Matches -->
      <div class="mt-10">
        <h3 class="text-xl font-semibold mb-4 text-indigo-600">Top Matches</h3>
        <p v-if="loadingMatches">Loading matches...</p>
        <pre
          v-else
          class="bg-gray-100 p-4 rounded whitespace-pre-wrap text-sm text-gray-800"
        >
{{ topMatches }}
        </pre>
      </div>

      <!-- Filters -->
      <div class="flex flex-col md:flex-row gap-4 mb-6 mt-10">
        <!-- Role Filter -->
        <select v-model="filters.role" class="border p-2 rounded w-full md:w-1/3">
          <option value="">All Roles</option>
          <option>Founder</option>
          <option>Engineer</option>
          <option>Designer</option>
          <option>Product Manager</option>
        </select>

        <!-- Skills Search -->
        <input
          v-model="filters.skills"
          type="text"
          placeholder="Search by skill (e.g. React)"
          class="border p-2 rounded w-full md:w-2/3"
        />
      </div>

      <!-- Cofounder Cards -->
      <div
        v-if="filteredUsers.length"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          v-for="user in filteredUsers"
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
        <p>No matching cofounders found...</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../services/supabase'

const router = useRouter()

const allUsers = ref([])
const filters = ref({
  role: '',
  skills: ''
})
const topMatches = ref('')
const loadingMatches = ref(false)

const handleLogout = async () => {
  await supabase.auth.signOut()
  router.push('/')
}

onMounted(async () => {
  const { data: authData } = await supabase.auth.getUser()
  const currentUserId = authData?.user?.id

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')

  if (error) {
    console.error('Error fetching profiles:', error)
    return
  }

  const currentUser = profiles.find(u => u.id === currentUserId)
  const otherUsers = profiles.filter(u => u.id !== currentUserId)
  allUsers.value = otherUsers

  await getTopMatches(currentUser, otherUsers)
})

const getTopMatches = async (currentUser, otherUsers) => {
  loadingMatches.value = true
  try {
    const res = await fetch('http://localhost:3000/api/match-cofounders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentUser, otherUsers })
    })
    const result = await res.json()
    topMatches.value = result.matches
  } catch (err) {
    console.error('Failed to fetch matches:', err)
  } finally {
    loadingMatches.value = false
  }
}

const filteredUsers = computed(() => {
  return allUsers.value.filter((user) => {
    const roleMatch = !filters.value.role || user.role === filters.value.role
    const skillMatch =
      !filters.value.skills ||
      user.skills?.toLowerCase().includes(filters.value.skills.toLowerCase())
    return roleMatch && skillMatch
  })
})
</script>
