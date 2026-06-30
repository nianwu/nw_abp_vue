/**
 * 应用配置 Store
 * 启动时从后端获取 ApplicationConfiguration 并缓存
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import httpClient from '@/api/http'
import type { ApplicationConfigurationDto } from '@/types/abp'

export const useAppConfigStore = defineStore(
  'app-config',
  () => {
    const config = ref<ApplicationConfigurationDto | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    async function fetchConfig(): Promise<void> {
      if (config.value) return // 已缓存
      loading.value = true
      error.value = null
      try {
        const { data } = await httpClient.get<ApplicationConfigurationDto>(
          '/api/abp/application-configuration',
          {
            params: { includeLocalizationResources: false },
          },
        )
        config.value = data
      } catch (e) {
        error.value = 'Failed to load application configuration'
        throw e
      } finally {
        loading.value = false
      }
    }

    return { config, loading, error, fetchConfig }
  },
)
