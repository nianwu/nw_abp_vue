<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ApplicationLayout from '@/layouts/ApplicationLayout.vue'
import AccountLayout from '@/layouts/AccountLayout.vue'
import EmptyLayout from '@/layouts/EmptyLayout.vue'

const route = useRoute()

const layoutMap: Record<string, typeof ApplicationLayout> = {
  application: ApplicationLayout,
  account: AccountLayout,
  empty: EmptyLayout,
}

const layout = computed(() => {
  const name = (route.meta.layout as string) || 'application'
  return layoutMap[name] || ApplicationLayout
})
</script>
