<template>
  <div class="p-4">
    <AbpDataTable
      ref="tableRef"
      :columns="columns"
      :api="fetchUsers"
      search-placeholder="搜索用户..."
    >
      <template #toolbar-actions>
        <el-button type="primary" @click="openCreate">新建用户</el-button>
      </template>
      <template #actions="{ row }">
        <el-button size="small" @click="openEdit(row as any)">编辑</el-button>
        <el-button size="small" @click="handlePermission(row as any)">权限</el-button>
        <el-button size="small" type="danger" @click="handleDelete(row as any)">删除</el-button>
      </template>
    </AbpDataTable>

    <UserCreateEditModal
      v-model:visible="modalVisible"
      :user-id="editingUserId"
      @saved="onSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { format } from 'date-fns'
import AbpDataTable from '@/components/AbpDataTable.vue'
import UserCreateEditModal from './components/UserCreateEditModal.vue'
import { showConfirm } from '@/components/AbpConfirmDialog'
import { showSuccess, showError } from '@/components/AbpToast'
import { openPermissionModal } from '@/utils/permission-modal'
import * as usersApi from '@/api/identity-users'
import type { IdentityUserDto } from '@/types/identity'
import type { PagedRequestDto } from '@/types/api'

const tableRef = ref<InstanceType<typeof AbpDataTable>>()
const modalVisible = ref(false)
const editingUserId = ref<string | null>(null)

const columns = [
  { prop: 'userName', label: '用户名', minWidth: '120' },
  { prop: 'name', label: '姓名', minWidth: '100' },
  { prop: 'surname', label: '姓氏', minWidth: '100' },
  { prop: 'email', label: '邮箱', minWidth: '160' },
  { prop: 'phoneNumber', label: '手机号', minWidth: '120' },
  { prop: 'creationTime', label: '创建时间', minWidth: '160', formatter: formatDateTime },
  { prop: 'lastModificationTime', label: '最后修改时间', minWidth: '160', formatter: formatDateTime },
]

function formatDateTime(_row: unknown, _col: unknown, cell: unknown): string {
  if (!cell) return '-'
  try { return format(new Date(cell as string), 'yyyy-MM-dd HH:mm:ss') }
  catch { return String(cell) }
}

async function fetchUsers(params: PagedRequestDto) {
  return usersApi.getUsers(params)
}

function openCreate() { editingUserId.value = null; modalVisible.value = true }
function openEdit(row: IdentityUserDto) { editingUserId.value = row.id; modalVisible.value = true }

async function handleDelete(row: IdentityUserDto) {
  const ok = await showConfirm({ title: '删除用户', message: `确定删除用户 "${row.userName}" 吗？` })
  if (!ok) return
  try {
    await usersApi.deleteUser(row.id)
    showSuccess('删除成功')
    tableRef.value?.refresh()
  } catch { showError('删除失败') }
}

function onSaved() { modalVisible.value = false; tableRef.value?.refresh() }
</script>
