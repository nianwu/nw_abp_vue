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
      <!-- Default Connection String -->
      <div class="mb-6">
        <label class="text-sm font-semibold text-gray-700">Default</label>
        <p class="text-xs text-gray-400 mb-2">默认连接字符串（如未指定则使用此连接）</p>
        <el-input
          v-model="defaultConnStr"
          type="textarea"
          :rows="3"
          placeholder="请输入默认连接字符串"
        />
      </div>

      <el-divider />

      <!-- Named Connection Strings -->
      <div class="flex items-center justify-between mb-3">
        <span class="text-sm font-semibold text-gray-700">命名连接字符串</span>
        <el-button size="small" type="primary" plain @click="handleAdd">
          + 新增
        </el-button>
      </div>

      <div v-if="connectionStrings.length === 0" class="text-center py-4 text-gray-400 text-sm">
        暂无命名连接字符串
      </div>

      <div v-for="(cs, index) in connectionStrings" :key="index" class="mb-4">
        <div class="flex items-center justify-between mb-1">
          <el-input
            v-model="cs.name"
            size="small"
            placeholder="连接字符串名称"
            style="width: 200px;"
          />
          <el-button size="small" type="danger" link @click="handleDelete(cs.name, index)">
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
import * as tenantApi from '../../api/tenant'

const props = defineProps<{
  visible: boolean
  tenantId: string | null
}>()

const emit = defineEmits<{
  'update:visible': [boolean]
}>()

const loading = ref(false)
const submitting = ref(false)
const defaultConnStr = ref('')
const originalDefault = ref('')
const connectionStrings = ref<{ name: string; value: string }[]>([])

watch(
  () => props.visible,
  async (v) => {
    if (!v || !props.tenantId) return
    loading.value = true
    try {
      const [defResp, namedResp] = await Promise.all([
        tenantApi.getDefaultConnectionString(props.tenantId),
        tenantApi.getConnectionStrings(props.tenantId),
      ])
      // getDefaultConnectionString wraps response in AxiosResponse, extract data
      const defVal = (defResp as any)?.data ?? defResp ?? ''
      defaultConnStr.value = typeof defVal === 'string' ? defVal : ''
      originalDefault.value = defaultConnStr.value
      connectionStrings.value = Object.entries(namedResp || {}).map(
        ([name, value]) => ({ name, value }),
      )
    } catch {
      defaultConnStr.value = ''
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
    // Save default connection string if changed
    if (defaultConnStr.value !== originalDefault.value) {
      if (defaultConnStr.value) {
        await tenantApi.updateDefaultConnectionString(props.tenantId, defaultConnStr.value)
      } else if (originalDefault.value) {
        await tenantApi.deleteDefaultConnectionString(props.tenantId)
      }
    }

    // Save named connection strings
    for (const cs of connectionStrings.value) {
      if (cs.name) {
        await tenantApi.setConnectionString(props.tenantId, cs.name, cs.value)
      }
    }

    showSuccess('连接字符串已保存')
    emit('update:visible', false)
  } catch {
    showError('保存失败')
  } finally {
    submitting.value = false
  }
}

function handleAdd() {
  connectionStrings.value.push({ name: '', value: '' })
}

async function handleDelete(name: string, index: number) {
  if (!props.tenantId) return
  // If it has a name, delete from backend; otherwise just remove locally
  if (name) {
    try {
      await tenantApi.deleteConnectionString(props.tenantId, name)
    } catch {
      showError('删除失败')
      return
    }
  }
  connectionStrings.value.splice(index, 1)
  if (name) showSuccess('已删除')
}
</script>
