<template>
  <div>
    <AbpDataTable
      ref="tableRef"
      :columns="columns"
      :api="fetchTenants"
      search-placeholder="搜索租户..."
      actions-width="300"
      storage-key="tenant-tenants"
    >
      <template #toolbar-actions>
        <el-button type="primary" @click="openCreate">新建租户</el-button>
      </template>
      <template #cell-isActive="{ row }">
        <el-switch
          :model-value="!!(row as any).isActive"
          :loading="togglingTenantId === (row as any).id"
          @change="(v) => handleToggleActive(row as any, !!v)"
        />
      </template>
      <template #actions="{ row }">
        <el-button size="small" link type="primary" :icon="Edit" @click="openEdit(row as any)">编辑</el-button>
        <el-button size="small" link type="success" :icon="Connection" @click="openConnectionStrings(row as any)">连接字符串</el-button>
        <el-button size="small" link type="danger" :icon="Delete" @click="handleDelete(row as any)">删除</el-button>
        <el-button size="small" link type="warning" :icon="Setting" @click="handleFeature(row as any)">功能</el-button>
      </template>
    </AbpDataTable>

    <TenantCreateEditModal
      v-model:visible="modalVisible"
      :tenant-id="editingTenantId"
      @saved="onSaved"
    />

    <ConnectionStringPanel
      v-model:visible="connectionStringVisible"
      :tenant-id="selectedTenantId"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Edit, Connection, Delete, Setting } from '@element-plus/icons-vue'
import AbpDataTable from '@/components/AbpDataTable.vue'
import TenantCreateEditModal from './components/TenantCreateEditModal.vue'
import ConnectionStringPanel from './components/ConnectionStringPanel.vue'
import { showConfirm } from '@/components/AbpConfirmDialog'
import { showSuccess, showError } from '@/components/AbpToast'
import { openFeatureModal } from '@/utils/feature-modal'
import * as tenantApi from '@/api/tenant'
import type { TenantDto } from '@/types/tenant'
import type { PagedRequestDto } from '@/types/api'

const tableRef = ref<InstanceType<typeof AbpDataTable>>()
const modalVisible = ref(false)
const connectionStringVisible = ref(false)
const editingTenantId = ref<string | null>(null)
const selectedTenantId = ref<string | null>(null)
const togglingTenantId = ref<string | null>(null)

const columns = [
  { prop: 'name', label: '名称', minWidth: '140' },
  { prop: 'adminEmailAddress', label: '管理员邮箱', minWidth: '180' },
  { prop: 'editionName', label: '版本', minWidth: '120' },
  { prop: 'isActive', label: '启用', width: '80', sortable: false },
  { prop: 'creationTime', label: '创建时间', minWidth: '160', dateRender: true, hideOnMobile: true },
  { prop: 'lastModificationTime', label: '最后修改时间', minWidth: '160', dateRender: true, hideOnMobile: true },
]

async function fetchTenants(params: PagedRequestDto) {
  return tenantApi.getTenants(params)
}

function openCreate() {
  editingTenantId.value = null
  modalVisible.value = true
}

function openEdit(row: TenantDto) {
  editingTenantId.value = row.id || null
  modalVisible.value = true
}

function openConnectionStrings(row: TenantDto) {
  selectedTenantId.value = row.id || null
  connectionStringVisible.value = true
}

async function handleToggleActive(row: TenantDto, active: boolean) {
  const previous = row.isActive
  togglingTenantId.value = row.id!
  try {
    await tenantApi.updateTenant(row.id!, {
      name: row.name || '',
      isActive: active,
      concurrencyStamp: row.concurrencyStamp,
    })
    row.isActive = active
    showSuccess(active ? '已启用' : '已禁用')
  } catch {
    row.isActive = previous
    showError('操作失败')
  } finally {
    togglingTenantId.value = null
  }
}

async function handleDelete(row: TenantDto) {
  const ok = await showConfirm({
    title: '删除租户',
    message: `确定删除租户 "${row.name}" 吗？`,
  })
  if (!ok) return
  try {
    await tenantApi.deleteTenant(row.id!)
    showSuccess('删除成功')
    tableRef.value?.refresh()
  } catch {
    showError('删除失败')
  }
}

function handleFeature(row: TenantDto) {
  if (!row.id) return
  const modal = openFeatureModal({
    providerName: 'T',
    providerKey: row.id,
  })
  modal.onSaved(() => {
    showSuccess('功能设置保存成功')
  })
  modal.open()
}

function onSaved() {
  modalVisible.value = false
  tableRef.value?.refresh()
}
</script>
