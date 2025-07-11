<template>
  <div class="min-h-screen bg-gray-50 p-8 text-gray-800">
    <div class="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
      <h2 class="text-2xl font-semibold mb-6 text-indigo-600">Complete your Crufindr profile</h2>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div>
          <label class="block mb-1 font-medium">Name</label>
          <input v-model="form.name" type="text" required class="w-full border border-gray-300 p-2 rounded" />
        </div>

        <div>
          <label class="block mb-1 font-medium">Role</label>
          <select v-model="form.role" required class="w-full border border-gray-300 p-2 rounded">
            <option disabled value="">Select your role</option>
            <option>Founder</option>
            <option>Engineer</option>
            <option>Designer</option>
            <option>Product Manager</option>
          </select>
        </div>

        <div>
          <label class="block mb-1 font-medium">Skills</label>
          <input
            v-model="form.skills"
            type="text"
            placeholder="e.g. JavaScript, Figma, Marketing"
            class="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div>
        <label class="block mb-1 font-medium">Bio</label>
        <textarea
            v-model="form.bio"
            rows="4"
            class="w-full border border-gray-300 p-2 rounded"
            placeholder="A short summary about you"
        ></textarea>
        <p v-if="generating" class="text-sm text-indigo-500 mt-1">Generating bio...</p>
        </div>


        <button
          type="submit"
          class="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
        >
          Save & Continue
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../services/supabase'

const router = useRouter()

const form = ref({
  name: '',
  role: '',
  skills: '',
  bio: ''
})

const generating = ref(false)

// Auto-generate bio when name, role, or skills change
watch(
  () => [form.value.name, form.value.role, form.value.skills],
  async ([name, role, skills]) => {
    if (name && role && skills) {
      generating.value = true
      try {
        const response = await fetch('http://localhost:3000/api/generate-bio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, role, skills })
        })
        const result = await response.json()
        form.value.bio = result.bio || ''
      } catch (err) {
        console.error('Bio generation error:', err)
      } finally {
        generating.value = false
      }
    }
  }
)

const handleSubmit = async () => {
  const { data: userData } = await supabase.auth.getUser()
  const user = userData?.user
  if (!user) return

  const { error } = await supabase.from('profiles').upsert({
    id: user.id,
    name: form.value.name,
    role: form.value.role,
    skills: form.value.skills,
    bio: form.value.bio
  })

  if (error) {
    alert('Error saving profile: ' + error.message)
  } else {
    router.push('/dashboard')
  }
}
</script>
