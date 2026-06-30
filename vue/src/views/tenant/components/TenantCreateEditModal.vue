<template>
  <AbpModal
    :visible="visible"
    :title="tenantId ? '编辑租户' : '新建租户'"
    :loading="submitting"
    @confirm="handleSubmit"
    @update:visible="$emit('update:visible', $event)"
  >
    <AbpDynamicForm v-model="formData" :fields="computedFields" :field-errors="fieldErrors" />
  </AbpModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import AbpModal from '@/components/AbpModal.vue'
import AbpDynamicForm from '@/components/AbpDynamicForm.vue'
import { showSuccess, showError } from '@/components/AbpToast'
import * as tenantApi from '@/api/tenant'
import { parseAbpError } from '@/utils/abp-error'
import type { AbpFormItem } from '@/types/abp'

const props = defineProps<{
  visible: boolean
  tenantId: string | null
}>()

const emit = defineEmits<{
  'update:visible': [boolean]
  saved: []
}>()

const submitting = ref(false)
const fieldErrors = ref<Record<string, string[]>>({})

const formData = ref<Record<string, unknown>>({
  name: '',
  adminEmailAddress: '',
  adminPassword: '',
  isActive: true,
})

const createFields: AbpFormItem[] = [
  { name: 'name', type: 'text', label: '名称', required: true },
  { name: 'adminEmailAddress', type: 'email', label: '管理员邮箱', required: true },
  { name: 'adminPassword', type: 'password', label: '管理员密码', required: true },
  { name: 'isActive', type: 'switch', label: '启用' },
]

const editFields: AbpFormItem[] = [
  { name: 'name', type: 'text', label: '名称', required: true },
  { name: 'isActive', type: 'switch', label: '启用' },
]

const computedFields = computed(() =>
  props.tenantId ? editFields : createFields,
)

// 编辑模式加载租户数据
watch(
  () => props.visible,
  async (v) => {
    if (!v) return
    fieldErrors.value = {}
    if (props.tenantId) {
      try {
        const tenant = await tenantApi.getTenant(props.tenantId)
        formData.value = {
          name: tenant.name || '',
          isActive: tenant.isActive ?? true,
        }
      } catch {
        showError('加载租户信息失败')
      }
    } else {
      formData.value = {
        name: '',
        adminEmailAddress: '',
        adminPassword: '',
        isActive: true,
      }
    }
  },
)

async function handleSubmit() {
  submitting.value = true
  try {
    if (props.tenantId) {
      await tenantApi.updateTenant(
        props.tenantId,
        formData.value as unknown as Parameters<typeof tenantApi.updateTenant>[1],
      )
    } else {
      await tenantApi.createTenant(
        formData.value as unknown as Parameters<typeof tenantApi.createTenant>[0],
      )
    }
    showSuccess(props.tenantId ? '更新成功' : '创建成功')
    emit('saved')
  } catch (e) {
    const parsed = parseAbpError(e)
    if (parsed?.fieldErrors) fieldErrors.value = parsed.fieldErrors
    showError(parsed?.message || '操作失败')
  } finally {
    submitting.value = false
  }
}
</script>
