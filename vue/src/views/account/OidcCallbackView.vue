<template>
  <div class="flex items-center justify-center h-screen">
    <p class="text-gray-500">正在登录...</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { handleCallback } = useAuth()

onMounted(async () => {
  try {
    await handleCallback()
  } catch {
    await router.push('/error/500')
  }
})
</script>
