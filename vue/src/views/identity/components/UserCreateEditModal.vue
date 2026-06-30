<template>
  <AbpModal
    :visible="visible"
    :title="userId ? '编辑用户' : '新建用户'"
    :loading="submitting"
    @confirm="handleSubmit"
    @update:visible="$emit('update:visible', $event)"
  >
    <el-tabs v-model="activeTab">
      <el-tab-pane label="基本信息" name="info">
        <AbpDynamicForm ref="formRef" v-model="formData" :fields="fields" :field-errors="fieldErrors" />
      </el-tab-pane>
      <el-tab-pane label="角色分配" name="roles" v-if="!userId">
        <el-transfer v-model="selectedRoles" :data="roleOptions" :titles="['可用角色', '已分配']" />
      </el-tab-pane>
    </el-tabs>
  </AbpModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import AbpModal from '@/components/AbpModal.vue'
import AbpDynamicForm from '@/components/AbpDynamicForm.vue'
import { showSuccess, showError } from '@/components/AbpToast'
import * as usersApi from '@/api/identity-users'
import * as rolesApi from '@/api/identity-roles'
import { parseAbpError } from '@/utils/abp-error'
import type { AbpFormItem } from '@/types/abp'

const props = defineProps<{ visible: boolean; userId: string | null }>()
const emit = defineEmits<{ 'update:visible': [boolean]; saved: [] }>()

const formRef = ref<InstanceType<typeof AbpDynamicForm>>()
const activeTab = ref('info')
const submitting = ref(false)
const fieldErrors = ref<Record<string, string[]>>({})
const selectedRoles = ref<string[]>([])

const formData = ref<Record<string, unknown>>({
  userName: '', name: '', surname: '', email: '', phoneNumber: '', password: '', isActive: true, lockoutEnabled: true,
})

const roleOptions = ref<{ key: string; label: string }[]>([])

const createFields: AbpFormItem[] = [
  { name: 'userName', type: 'text', label: '用户名', required: true },
  { name: 'name', type: 'text', label: '姓名' },
  { name: 'surname', type: 'text', label: '姓氏' },
  { name: 'email', type: 'email', label: '邮箱', required: true },
  { name: 'phoneNumber', type: 'text', label: '手机号' },
  { name: 'password', type: 'password', label: '密码', required: true },
  { name: 'isActive', type: 'switch', label: '启用' },
]

const editFields: AbpFormItem[] = [
  { name: 'userName', type: 'text', label: '用户名', required: true },
  { name: 'name', type: 'text', label: '姓名' },
  { name: 'surname', type: 'text', label: '姓氏' },
  { name: 'email', type: 'email', label: '邮箱', required: true },
  { name: 'phoneNumber', type: 'text', label: '手机号' },
  { name: 'password', type: 'password', label: '密码', placeholder: '留空则不修改密码' },
  { name: 'isActive', type: 'switch', label: '启用' },
]

const fields = computed(() => props.userId ? editFields : createFields)

// 编辑模式加载用户数据
watch(() => props.visible, async (v) => {
  if (!v) return
  fieldErrors.value = {}
  if (props.userId) {
    try {
      const user = await usersApi.getUser(props.userId)
      formData.value = { ...user, password: '' }
    } catch { showError('加载用户信息失败') }
  } else {
    formData.value = { userName: '', name: '', surname: '', email: '', phoneNumber: '', password: '', isActive: true, lockoutEnabled: true }
    // 加载角色
    try {
      const res = await rolesApi.getAllRoles()
      roleOptions.value = (res.items || []).map((r) => ({ key: r.name || '', label: r.name || '' }))
    } catch { /**/ }
  }
})

async function handleSubmit() {
  const valid = await formRef.value?.validate()
  if (!valid) return
  submitting.value = true
  try {
    if (props.userId) {
      await usersApi.updateUser(props.userId, formData.value as unknown as Parameters<typeof usersApi.updateUser>[1])
    } else {
      await usersApi.createUser(formData.value as unknown as Parameters<typeof usersApi.createUser>[0])
    }
    showSuccess(props.userId ? '更新成功' : '创建成功')
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
