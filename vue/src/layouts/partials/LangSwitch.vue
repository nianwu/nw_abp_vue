<template>
  <el-dropdown trigger="click" @command="changeLanguage">
    <el-button link class="text-white">
      {{ currentLanguage }} <el-icon><ArrowDown /></el-icon>
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="lang in languages"
          :key="lang.cultureName"
          :command="lang.cultureName"
        >{{ lang.displayName }}</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import { useAppConfigStore } from '@/stores/app-config'
import { useLocalization } from '@/composables/useLocalization'

const appConfig = useAppConfigStore()
const { changeLanguage, locale } = useLocalization()

const languages = computed(() => appConfig.config?.localization?.languages || [])
const currentLanguage = computed(() => {
  const lang = languages.value.find((l) => l.cultureName === locale.value)
  return lang?.displayName || locale.value
})
</script>
