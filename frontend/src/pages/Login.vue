<template>
  <div class="auth-container">
    <h2>Login / Signup</h2>
    <input v-model="email" placeholder="Enter your email" />
    <button @click="signIn">Send Magic Link</button>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '../services/supabase'

const email = ref('')
const message = ref('')

const signIn = async () => {
  const { error } = await supabase.auth.signInWithOtp({ email: email.value })
  message.value = error ? error.message : 'Check your email for a magic link'
}
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: auto;
  text-align: center;
  padding: 40px;
}
</style>
