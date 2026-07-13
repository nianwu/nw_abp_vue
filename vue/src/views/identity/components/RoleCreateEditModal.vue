<template>
  <AbpModal
    :visible="visible"
    :title="roleId ? '编辑角色' : '新建角色'"
    :loading="submitting"
    @confirm="handleSubmit"
    @update:visible="$emit('update:visible', $event)"
  >
    <AbpDynamicForm ref="formRef" v-model="formData" :fields="fields" :field-errors="fieldErrors" />
  </AbpModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import AbpModal from '@/components/AbpModal.vue'
import AbpDynamicForm from '@/components/AbpDynamicForm.vue'
import { showSuccess, showError } from '@/components/AbpToast'
import * as identityRolesApi from '@/api/identity-roles'
import { parseAbpError } from '@/utils/abp-error'
import type { AbpFormItem } from '@/types/abp'

const props = defineProps<{ visible: boolean; roleId: string | null }>()
const emit = defineEmits<{ 'update:visible': [boolean]; saved: [] }>()

const formRef = ref<InstanceType<typeof AbpDynamicForm>>()
const submitting = ref(false)
const fieldErrors = ref<Record<string, string[]>>({})

const formData = ref<Record<string, unknown>>({
  name: '',
  isDefault: false,
  isPublic: false,
})

const fields: AbpFormItem[] = [
  { name: 'name', type: 'text', label: '角色名', required: true },
  { name: 'isDefault', type: 'switch', label: '默认角色' },
  { name: 'isPublic', type: 'switch', label: '公开角色' },
]

// 编辑模式加载角色数据
watch(() => props.visible, async (v) => {
  if (!v) return
  fieldErrors.value = {}
  if (props.roleId) {
    try {
      const role = await identityRolesApi.getRole(props.roleId)
      formData.value = { name: role.name ?? '', isDefault: role.isDefault, isPublic: role.isPublic }
    } catch { showError('加载角色信息失败') }
  } else {
    formData.value = { name: '', isDefault: false, isPublic: false }
  }
})

async function handleSubmit() {
  const valid = await formRef.value?.validate()
  if (!valid) return
  submitting.value = true
  try {
    if (props.roleId) {
      await identityRolesApi.updateRole(props.roleId, formData.value as unknown as Parameters<typeof identityRolesApi.updateRole>[1])
    } else {
      await identityRolesApi.createRole(formData.value as unknown as Parameters<typeof identityRolesApi.createRole>[0])
    }
    showSuccess(props.roleId ? '更新成功' : '创建成功')
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
