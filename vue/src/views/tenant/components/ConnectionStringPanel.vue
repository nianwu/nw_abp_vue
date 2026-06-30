<template>
  <AbpModal
    :visible="visible"
    title="连接字符串"
    size="lg"
    :loading="submitting"
    confirm-label="保存"
    @confirm="handleSave"
    @update:visible="$emit('update:visible', $event)"
  >
    <div v-if="loading" class="text-center py-8 text-gray-400">加载中...</div>
    <template v-else>
      <div v-if="connectionStrings.length === 0" class="text-center py-8 text-gray-400">
        暂无连接字符串
      </div>
      <div v-for="(cs, index) in connectionStrings" :key="index" class="mb-4">
        <div class="flex items-center justify-between mb-1">
          <label class="text-sm font-medium text-gray-600">{{ cs.name }}</label>
          <el-button size="small" type="danger" link @click="handleDelete(cs.name)">
            删除
          </el-button>
        </div>
        <el-input
          v-model="cs.value"
          type="textarea"
          :rows="3"
          placeholder="请输入连接字符串"
        />
        <el-divider v-if="index < connectionStrings.length - 1" />
      </div>
    </template>
  </AbpModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import AbpModal from '@/components/AbpModal.vue'
import { showSuccess, showError } from '@/components/AbpToast'
import * as tenantApi from '@/api/tenant'

const props = defineProps<{
  visible: boolean
  tenantId: string | null
}>()

const emit = defineEmits<{
  'update:visible': [boolean]
}>()

const loading = ref(false)
const submitting = ref(false)
const connectionStrings = ref<{ name: string; value: string }[]>([])

watch(
  () => props.visible,
  async (v) => {
    if (!v || !props.tenantId) return
    loading.value = true
    try {
      const strings = await tenantApi.getConnectionStrings(props.tenantId)
      connectionStrings.value = Object.entries(strings || {}).map(
        ([name, value]) => ({ name, value }),
      )
    } catch {
      connectionStrings.value = []
    } finally {
      loading.value = false
    }
  },
)

async function handleSave() {
  if (!props.tenantId) return
  submitting.value = true
  try {
    for (const cs of connectionStrings.value) {
      await tenantApi.setConnectionString(props.tenantId, cs.name, cs.value)
    }
    showSuccess('连接字符串已保存')
    emit('update:visible', false)
  } catch {
    showError('保存失败')
  } finally {
    submitting.value = false
  }
}

async function handleDelete(name: string) {
  if (!props.tenantId) return
  try {
    await tenantApi.deleteConnectionString(props.tenantId, name)
    connectionStrings.value = connectionStrings.value.filter(
      (cs) => cs.name !== name,
    )
    showSuccess('已删除')
  } catch {
    showError('删除失败')
  }
}
</script>
