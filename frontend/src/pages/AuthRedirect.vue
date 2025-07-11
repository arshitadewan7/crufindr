<template>
  <div class="min-h-screen flex items-center justify-center text-gray-600">
    <p class="text-lg">Logging you in...</p>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { supabase } from '../services/supabase'

const router = useRouter()

onMounted(async () => {
  const { data: userData } = await supabase.auth.getUser()
  const user = userData?.user

  if (!user) {
    router.push('/')
    return
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .maybeSingle()

  if (error) {
    console.error('Error checking profile:', error)
    router.push('/')
  } else if (profile) {
    router.push('/dashboard')
  } else {
    router.push('/onboarding')
  }
})
</script>
