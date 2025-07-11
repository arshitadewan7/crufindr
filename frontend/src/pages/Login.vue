<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center px-4">
    <div class="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
      <h2 class="text-3xl font-bold text-center text-indigo-600 mb-6">Welcome to Crufindr</h2>

      <input
        v-model="email"
        type="email"
        placeholder="Enter your email"
        class="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />

      <button
        @click="handleLogin"
        :disabled="loading"
        class="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
      >
        Send Magic Link
      </button>

      <p v-if="message" class="text-center text-sm mt-4 text-gray-700">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '../services/supabase'

const email = ref('')
const loading = ref(false)
const message = ref('')

const handleLogin = async () => {
  loading.value = true

  const { error } = await supabase.auth.signInWithOtp({
    email: email.value,
    options: {
      emailRedirectTo: window.location.origin + '/auth-redirect'
    }
  })

  if (error) {
    alert('Error sending magic link: ' + error.message)
  } else {
    message.value = 'Check your email for the magic link!'
  }

  loading.value = false
}
</script>
