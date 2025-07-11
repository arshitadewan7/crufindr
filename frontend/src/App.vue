<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from './services/supabase'

const router = useRouter()

onMounted(async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const user = session?.user
  if (user) {
    // Check if user has a profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile || error) {
      router.push('/onboarding')
    } else {
      router.push('/dashboard')
    }
  }
})
</script>
