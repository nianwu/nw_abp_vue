<template>
  <span v-if="isMultiTenancyEnabled" class="text-white text-sm mr-2">
    {{ currentTenant }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfigStore } from '@/stores/app-config'

const appConfig = useAppConfigStore()
const isMultiTenancyEnabled = computed(() => appConfig.config?.multiTenancy?.isEnabled || false)
const currentTenant = computed(() => appConfig.config?.currentTenant?.name || 'Host')
</script>
