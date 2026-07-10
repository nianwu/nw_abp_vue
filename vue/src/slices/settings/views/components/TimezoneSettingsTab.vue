<template>
  <div>
    <div v-if="loading" class="py-8 text-center text-gray-400">加载中...</div>

    <div v-else-if="timezoneError" class="py-8 text-center text-red-400">
      {{ timezoneError }}
      <el-button class="ml-3" size="small" @click="loadTimezones">重试</el-button>
    </div>

    <template v-else>
      <p class="text-sm text-gray-500 mb-4">请选择您所在的时区，系统将根据所选时区显示和转换时间。</p>
      <el-form label-position="top">
        <el-form-item label="时区">
          <el-select
            v-model="selectedTimezone"
            class="w-full"
            placeholder="请选择时区"
            filterable
            clearable
          >
            <el-option
              v-for="tz in timezoneList"
              :key="tz"
              :label="tz"
              :value="tz"
            />
          </el-select>
        </el-form-item>
        <p v-if="selectedTimezone" class="mt-1 text-sm text-gray-400">
          当前本地时区：{{ localTimezone }}
        </p>
      </el-form>

      <div class="mt-6">
        <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSessionStore } from '@/slices/core'
import { showSuccess, showError } from '@/components/AbpToast'
import * as settingsApi from '@/api/settings'

// ---- stores ----
const sessionStore = useSessionStore()

// ---- state ----
const loading = ref(true)
const saving = ref(false)
const timezoneList = ref<string[]>([])
const selectedTimezone = ref<string>('')
const localTimezone = ref('')
const timezoneError = ref('')

// ---- load ----
async function loadTimezones() {
  loading.value = true
  timezoneError.value = ''
  try {
    const zones = await settingsApi.getTimezones()
    timezoneList.value = zones

    // pre-select current timezone from session or local
    selectedTimezone.value = sessionStore.timezone || localTimezone.value
  } catch {
    timezoneError.value = '加载时区列表失败'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  localTimezone.value = Intl.DateTimeFormat().resolvedOptions().timeZone
  loadTimezones()
})

// ---- save ----
async function handleSave() {
  if (!selectedTimezone.value) {
    showError('请选择一个时区')
    return
  }

  saving.value = true
  try {
    await settingsApi.updateTimezone(selectedTimezone.value)

    // update session store — http interceptor reads X-Timezone from here
    sessionStore.timezone = selectedTimezone.value

    showSuccess('时区设置已保存')
  } catch {
    showError('保存时区设置失败')
  } finally {
    saving.value = false
  }
}
</script>
