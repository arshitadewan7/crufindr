<template>
  <div class="relative min-h-screen overflow-x-hidden text-gray-800 bg-gradient-to-br from-white via-gray-100 to-gray-200">

    <!-- Animated Blurred Background Circle -->
    <div class="absolute top-[-200px] right-[-200px] w-[500px] h-[500px] rounded-full bg-indigo-400 opacity-20 blur-3xl z-0"></div>

    <header class="flex justify-between items-center px-10 py-4 sticky top-0 backdrop-blur-lg bg-white/60 border-b shadow z-50">
      <h1 class="text-2xl font-bold text-indigo-600">Crufindr</h1>
      <button @click="handleLogout"
        class="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-xl hover:shadow-lg transition">
        Logout
      </button>
    </header>

    <main class="relative z-10 max-w-7xl mx-auto px-10 pt-20 pb-32">

      <motion.div v-motion-fade class="mb-20">
        <h2 class="text-6xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          Welcome, {{ currentUser?.name || 'Founder' }} 👋
        </h2>
        <p class="text-gray-500 text-lg mt-2">Your cofounder search starts here.</p>
      </motion.div>

      <motion.div v-motion-fade class="flex flex-col md:flex-row gap-6 mb-20">
        <select v-model="filters.role"
          class="glass-input p-3 rounded-xl w-full md:w-1/3 focus:ring-indigo-500 focus:border-indigo-500 transition">
          <option value="">All Roles</option>
          <option>Founder</option>
          <option>Engineer</option>
          <option>Designer</option>
          <option>Product Manager</option>
        </select>

        <input v-model="filters.skills" type="text" placeholder="Search by skill (e.g. React)"
          class="glass-input p-3 rounded-xl w-full md:w-2/3 focus:ring-indigo-500 focus:border-indigo-500 transition" />
      </motion.div>

      <motion.div v-motion-fade class="mb-20">
        <h3 class="text-3xl font-semibold mb-6 text-indigo-600">Top Matches</h3>
        <p v-if="loadingMatches" class="text-gray-600">Fetching AI suggestions...</p>
        <pre v-else
          class="glass-card rounded-2xl p-6 shadow text-gray-800 whitespace-pre-wrap text-sm min-h-[100px]">{{ topMatches }}</pre>

        <button @click="rerunMatching" :disabled="loadingMatches"
          class="mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-xl hover:shadow-xl transition disabled:opacity-50">
          Re-run Matching
        </button>
      </motion.div>

      <motion.div v-motion-fade v-if="filteredUsers.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="user in filteredUsers" :key="user.id" ref="tiltRefs"
          class="glass-card p-6 rounded-3xl shadow-md transition transform hover:-translate-y-1 cursor-pointer">
          <h3 class="text-xl font-bold text-gray-900">{{ user.name }}</h3>
          <p class="text-sm text-gray-500 mb-2">{{ user.role }}</p>
          <p class="text-sm text-gray-700"><strong>Skills:</strong> {{ user.skills }}</p>
          <p class="text-sm text-gray-600 italic mt-2">{{ user.bio || 'No bio yet.' }}</p>
        </div>
      </motion.div>

      <motion.div v-motion-fade v-else class="text-center text-gray-500 mt-20">
        <p>No matching cofounders found...</p>
      </motion.div>

    </main>

    <!-- Curved SVG Divider Footer -->
    <svg class="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 320">
      <path fill="#ffffff" fill-opacity="1"
        d="M0,224L80,202.7C160,181,320,139,480,144C640,149,800,203,960,197.3C1120,192,1280,128,1360,96L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z">
      </path>
    </svg>

    <footer class="relative text-center text-gray-400 py-6 text-sm z-10">
      © 2025 Crufindr. All rights reserved.
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../services/supabase'
import VanillaTilt from 'vanilla-tilt'
import { useMotion } from '@motionone/vue'

const router = useRouter()
const tiltRefs = ref([])

const allUsers = ref([])
const filters = ref({
  role: '',
  skills: ''
})
const topMatches = ref('')
const loadingMatches = ref(false)
const currentUser = ref(null)

const handleLogout = async () => {
  await supabase.auth.signOut()
  router.push('/')
}

onMounted(async () => {
  const { data: authData } = await supabase.auth.getUser()
  const currentUserId = authData?.user?.id

  const { data: profiles, error } = await supabase.from('profiles').select('*')
  if (error) {
    console.error('Error fetching profiles:', error)
    return
  }

  currentUser.value = profiles.find(u => u.id === currentUserId)
  const otherUsers = profiles.filter(u => u.id !== currentUserId)
  allUsers.value = otherUsers

  await nextTick()
  tiltRefs.value.forEach(card => {
    VanillaTilt.init(card, {
      max: 15,
      speed: 400,
      glare: true,
      'max-glare': 0.2
    })
  })

  const { data: savedMatches } = await supabase
    .from('matches')
    .select('matches')
    .eq('user_id', currentUserId)
    .maybeSingle()

  if (savedMatches?.matches) {
    topMatches.value = savedMatches.matches
  } else {
    await getTopMatches(currentUser.value, otherUsers)
  }
})

const getTopMatches = async (currentUser, otherUsers) => {
  loadingMatches.value = true
  try {
    const res = await fetch('https://refactored-engine-v6ppjpgp9gw43qx5-3000.app.github.dev/api/match-cofounders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentUser, otherUsers })
    })
    const result = await res.json()
    topMatches.value = result.matches

    await fetch('https://refactored-engine-v6ppjpgp9gw43qx5-3000.app.github.dev/api/save-matches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: currentUser.id,
        matches: result.matches,
      })
    })
  } catch (err) {
    console.error('Failed to fetch matches:', err)
  } finally {
    loadingMatches.value = false
  }
}

const rerunMatching = async () => {
  await getTopMatches(currentUser.value, allUsers.value)
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

<style scoped>
.glass-input {
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition: 0.3s ease;
}

.glass-input:focus {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.glass-card {
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  transition: 0.3s all;
}

.glass-card:hover {
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
}
</style>
