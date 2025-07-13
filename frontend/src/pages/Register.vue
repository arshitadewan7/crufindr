<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center px-4">
    <div class="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
      <h2 class="text-3xl font-bold text-center text-indigo-600 mb-6">Create your Crufindr account</h2>

      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />

      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />

      <button
        @click="handleRegister"
        :disabled="loading"
        class="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
      >
        Register
      </button>

      <p v-if="errorMsg" class="text-sm text-red-500 text-center mt-4">{{ errorMsg }}</p>

      <p class="text-center mt-4 text-sm text-gray-600">
  Already have an account?
  <button
    @click="goToLogin"
    class="text-indigo-600 font-medium hover:underline"
  >
    Login here
  </button>
</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../services/supabase'

const router = useRouter()

const email = ref('')
const password = ref('')
const errorMsg = ref('')
const loading = ref(false)

const goToLogin = () => {
  router.push('/login')
}

const handleRegister = async () => {
  loading.value = true
  errorMsg.value = ''

  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
  })

  if (error) {
    errorMsg.value = error.message
  } else {
    router.push('/onboarding')
  }

  loading.value = false
}
</script>

