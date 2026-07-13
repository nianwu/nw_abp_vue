<template>
  <div>
    <div v-if="loading" class="py-8 text-center text-gray-400">加载中...</div>

    <template v-else>
      <el-form label-position="top">
        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="最小长度">
            <el-input-number v-model="form.requiredLength" :min="1" :max="128" />
          </el-form-item>
          <el-form-item label="最少不同字符数">
            <el-input-number v-model="form.requiredUniqueChars" :min="0" :max="128" />
          </el-form-item>
        </div>

        <div class="grid grid-cols-2 gap-4 mt-2">
          <el-form-item label="必须包含数字">
            <el-switch v-model="form.requireDigit" />
          </el-form-item>
          <el-form-item label="必须包含小写字母">
            <el-switch v-model="form.requireLowercase" />
          </el-form-item>
          <el-form-item label="必须包含大写字母">
            <el-switch v-model="form.requireUppercase" />
          </el-form-item>
          <el-form-item label="必须包含特殊字符">
            <el-switch v-model="form.requireNonAlphanumeric" />
          </el-form-item>
        </div>
      </el-form>

      <div class="mt-6">
        <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import {
  standaloneGetPasswordSettings,
  standaloneUpdatePasswordSettings,
} from '../../stores/settings-store'
import type { IdentityPasswordSettingsDto } from '@/types/settings'
import { showSuccess } from '@/components/AbpToast'

// ---- state ----
const loading = ref(true)
const saving = ref(false)

const form = reactive<IdentityPasswordSettingsDto>({
  requiredLength: 6,
  requiredUniqueChars: 1,
  requireNonAlphanumeric: true,
  requireLowercase: true,
  requireUppercase: true,
  requireDigit: true,
})

// ---- load ----
onMounted(() => {
  const saved = standaloneGetPasswordSettings()
  if (saved) {
    Object.assign(form, saved)
  }
  loading.value = false
})

// ---- save ----
function handleSave() {
  saving.value = true
  try {
    standaloneUpdatePasswordSettings({ ...form })
    showSuccess('密码复杂度设置已保存')
  } finally {
    saving.value = false
  }
}
</script>
