<template>
  <div>
    <AbpDataTable
      ref="tableRef"
      :columns="columns"
      :api="fetchRoles"
      search-placeholder="搜索角色..."
      storage-key="identity-roles"
    >
      <template #toolbar-actions>
        <el-button type="primary" @click="openCreate">新建角色</el-button>
      </template>

      <!-- isDefault 徽章列 -->
      <template #cell-isDefault="{ row }">
        <el-tag v-if="(row as any).isDefault" type="success" size="small">默认</el-tag>
        <span v-else class="text-gray-400">-</span>
      </template>

      <!-- isPublic 徽章列 -->
      <template #cell-isPublic="{ row }">
        <el-tag v-if="(row as any).isPublic" type="info" size="small">公开</el-tag>
        <span v-else class="text-gray-400">-</span>
      </template>

      <!-- isStatic 徽章列 -->
      <template #cell-isStatic="{ row }">
        <el-tag v-if="(row as any).isStatic" type="warning" size="small">静态</el-tag>
        <span v-else class="text-gray-400">-</span>
      </template>

      <template #actions="{ row }">
        <el-button size="small" link type="primary" :icon="Edit" @click="openEdit(row as any)">编辑</el-button>
        <el-button
          size="small"
          link
          type="danger"
          :icon="Delete"
          :disabled="(row as any).isStatic"
          @click="handleDelete(row as any)"
        >删除</el-button>
        <el-button size="small" link type="warning" :icon="Lock" @click="handleOpenPermission(row as any)">权限</el-button>
      </template>
    </AbpDataTable>

    <RoleCreateEditModal
      v-model:visible="modalVisible"
      :role-id="editingRoleId"
      @saved="onSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Edit, Lock, Delete } from '@element-plus/icons-vue'
import AbpDataTable from '@/components/AbpDataTable.vue'
import RoleCreateEditModal from './components/RoleCreateEditModal.vue'
import { showConfirm } from '@/components/AbpConfirmDialog'
import { showSuccess, showError } from '@/components/AbpToast'
import { openPermissionModal } from '@/slices/permission'
import * as identityRolesApi from '@/api/identity-roles'
import type { IdentityRoleDto } from '@/types/identity'
import type { PagedRequestDto } from '@/types/api'

const tableRef = ref<InstanceType<typeof AbpDataTable>>()
const modalVisible = ref(false)
const editingRoleId = ref<string | null>(null)

const columns = [
  { prop: 'name', label: '角色名', minWidth: '140' },
  { prop: 'isDefault', label: '默认角色', minWidth: '100' },
  { prop: 'isPublic', label: '公开角色', minWidth: '100' },
  { prop: 'isStatic', label: '静态角色', minWidth: '100' },
  { prop: 'creationTime', label: '创建时间', minWidth: '160', dateRender: true, hideOnMobile: true },
  { prop: 'lastModificationTime', label: '最后修改时间', minWidth: '160', dateRender: true, hideOnMobile: true },
]

async function fetchRoles(params: PagedRequestDto) {
  return identityRolesApi.getRoles(params)
}

function openCreate() { editingRoleId.value = null; modalVisible.value = true }
function openEdit(row: IdentityRoleDto) { editingRoleId.value = row.id; modalVisible.value = true }

async function handleDelete(row: IdentityRoleDto) {
  if (row.isStatic) return
  const ok = await showConfirm({ title: '删除角色', message: `确定删除角色 "${row.name}" 吗？` })
  if (!ok) return
  try {
    await identityRolesApi.deleteRole(row.id)
    showSuccess('删除成功')
    tableRef.value?.refresh()
  } catch { showError('删除失败') }
}

function handleOpenPermission(row: IdentityRoleDto) {
  if (!row.name) return
  const modal = openPermissionModal({
    providerName: 'R',
    providerKey: row.name,
  })
  modal.onSaved(() => {
    showSuccess('权限保存成功')
    tableRef.value?.refresh()
  })
  modal.open()
}

function onSaved() { modalVisible.value = false; tableRef.value?.refresh() }
</script>
