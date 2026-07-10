<template>
  <el-dialog
    v-model="dialogVisible"
    title="权限管理"
    :width="isMobile ? '100%' : '900px'"
    :fullscreen="isMobile"
    :close-on-click-modal="false"
    :before-close="handleBeforeClose"
    @open="handleOpen"
    destroy-on-close
  >
    <div v-loading="loading" class="permission-modal-body">
      <AbpEmptyState v-if="!loading && permissionGroups.length === 0" />

      <el-tabs v-model="activeTab" v-else>
        <!-- Permission Groups Tab -->
        <el-tab-pane label="权限组" name="groups">
          <el-tabs v-model="activeGroupName" tab-position="left" class="group-tabs">
            <el-tab-pane
              v-for="group in permissionGroups"
              :key="group.name"
              :label="group.displayName || group.name"
              :name="group.name!"
            >
              <el-tree
                :ref="(el: any) => setTreeRef(group.name!, el)"
                :data="buildTree(group.permissions)"
                :props="treeProps"
                show-checkbox
                node-key="id"
                default-expand-all
                check-strictly
                @check="incrementRevision"
              >
                <template #default="{ data }">
                  <span class="permission-node">
                    <span class="permission-label">{{ data.label }}</span>
                    <span v-if="data.grantedProviders && data.grantedProviders.length" class="grant-badges">
                      <el-tooltip
                        v-for="p in data.grantedProviders"
                        :key="`${p.providerName}-${p.providerKey}`"
                        :content="p.providerName === 'R' ? '已通过配置角色获取该权限' : ''"
                        :disabled="p.providerName !== 'R'"
                        placement="top"
                      >
                        <el-tag
                          :type="badgeType(p.providerName)"
                          size="small"
                          class="grant-tag"
                        >
                          {{ providerLabel(p.providerName) }}
                        </el-tag>
                      </el-tooltip>
                    </span>
                  </span>
                </template>
              </el-tree>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>

        <!-- Resource Permissions Tab -->
        <el-tab-pane name="resources">
          <template #label>
            <span>资源权限</span>
            <el-tooltip content="查看资源权限说明" placement="top">
              <el-icon class="tab-help-icon" @click.stop="openResourceDoc"><QuestionFilled /></el-icon>
            </el-tooltip>
          </template>
          <div class="resource-permissions-panel">
            <!-- LIST VIEW -->
            <template v-if="resourceView === 'list'">
              <div class="rp-toolbar">
                <el-button type="primary" size="small" @click="showResourceAdd">添加资源权限</el-button>
              </div>

              <el-form class="rp-search-form" inline>
                <el-form-item label="资源类型" class="rp-resource-type-item">
                  <el-select v-model="rpSearch.resourceName" placeholder="选择" class="!w-full" @change="onRpResourceTypeChange">
                    <el-option
                      v-for="p in resourceProviders"
                      :key="p.name"
                      :label="p.displayName || p.name"
                      :value="p.name!"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <template #label>
                    资源密钥
                    <el-tooltip content="查看资源密钥说明" placement="top">
                      <el-icon class="label-help-icon" style="height: 100%" @click.stop="openResourceKeyDoc"><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </template>
                  <el-input v-model="rpSearch.resourceKey" placeholder="输入资源密钥" style="width:200px" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="searchResourcePermissions">查询</el-button>
                </el-form-item>
              </el-form>

              <el-table
                :data="resourcePermissions"
                v-loading="resourcesLoading"
                empty-text="请在上方选择资源类型和密钥后查询"
                stripe
                size="small"
              >
                <el-table-column prop="providerDisplayName" label="资源类型" min-width="100" />
                <el-table-column prop="providerKey" label="资源密钥" min-width="160" />
                <el-table-column label="权限" min-width="200">
                  <template #default="{ row }">
                    {{ row.permissions?.map((p: any) => p.displayName || p.name).join(', ') || '-' }}
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="160" fixed="right">
                  <template #default="{ row }">
                    <el-button size="small" @click="showResourceEdit(row)">编辑</el-button>
                    <el-button size="small" type="danger" @click="removeResourcePermission(row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>

            <!-- ADD VIEW -->
            <template v-if="resourceView === 'add'">
              <h4 class="rp-section-title">添加资源权限</h4>
              <el-form label-width="100px" class="rp-form">
                <el-form-item label="资源类型" class="rp-resource-type-item">
                  <el-select v-model="rpAdd.resourceName" placeholder="选择资源类型" class="!w-full" @change="onRpAddTypeChange">
                    <el-option
                      v-for="p in resourceProviders"
                      :key="p.name"
                      :label="p.displayName || p.name"
                      :value="p.name!"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="搜索资源">
                  <el-input v-model="rpAdd.searchQuery" placeholder="输入关键字搜索" style="width:240px" />
                  <el-button style="margin-left:8px" @click="searchRpKeys">搜索</el-button>
                </el-form-item>
                <el-form-item label="选择资源">
                  <el-select v-model="rpAdd.resourceKey" placeholder="选择资源" style="width:300px">
                    <el-option
                      v-for="k in rpSearchResults"
                      :key="k.providerKey"
                      :label="k.providerDisplayName || k.providerKey"
                      :value="k.providerKey!"
                    />
                  </el-select>
                  <el-tooltip content="查看资源密钥说明" placement="top">
                    <el-button size="small" text type="info" @click="openResourceKeyDoc">
                      <el-icon><QuestionFilled /></el-icon>
                    </el-button>
                  </el-tooltip>
                </el-form-item>
                <el-form-item label="权限级别" v-if="rpAddLevels.length">
                  <el-checkbox-group v-model="rpAdd.permissions">
                    <el-checkbox v-for="d in rpAddLevels" :key="d.name" :label="d.name" :value="d.name">
                      {{ d.displayName || d.name }}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="confirmAddResourcePermission" :disabled="!rpAdd.resourceKey || !rpAdd.permissions.length">
                    确认添加
                  </el-button>
                  <el-button @click="cancelResourceAdd">取消</el-button>
                </el-form-item>
              </el-form>
            </template>

            <!-- EDIT VIEW -->
            <template v-if="resourceView === 'edit' && rpEditItem">
              <h4 class="rp-section-title">编辑资源权限</h4>
              <el-form label-width="100px" class="rp-form">
                <el-form-item label="资源类型">
                  <span>{{ rpEditItem.providerDisplayName || rpEditItem.providerName }}</span>
                </el-form-item>
                <el-form-item label="资源密钥">
                  <span>{{ rpEditItem.providerKey }}</span>
                </el-form-item>
                <el-form-item label="当前权限">
                  <span>{{ rpEditItem.permissions?.map((p: any) => p.displayName || p.name).join(', ') || '-' }}</span>
                </el-form-item>
                <el-form-item label="操作">
                  <el-button type="danger" @click="removeResourcePermission(rpEditItem)">移除此资源权限</el-button>
                  <el-button @click="resourceView = 'list'">返回列表</el-button>
                </el-form-item>
              </el-form>
            </template>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- Change summary -->
    <div v-if="changeCount > 0 && activeTab === 'groups'" class="change-summary">
      <span class="change-grant">授权 {{ grantCount }} 项</span>
      <span class="change-sep">/</span>
      <span class="change-revoke">回收 {{ revokeCount }} 项</span>
    </div>

    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" :loading="saving" :disabled="saving" @click="handleSave">
        保存
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, reactive, nextTick, onMounted, onUnmounted } from 'vue'
import type { TreeNodeData } from 'element-plus/es/components/tree-v2/src/types'
import { QuestionFilled } from '@element-plus/icons-vue'
import * as permissionsApi from '@/api/permission'
import type {
  PermissionGroupDto,
  PermissionGrantInfoDto,
  ProviderInfoDto,
  UpdatePermissionDto,
  ResourcePermissionGrantInfoDto,
  ResourceProviderDto,
  ResourcePermissionDefinitionDto,
  SearchProviderKeyInfo,
} from '@/types/permission'

// ============================================================
// Props / Emits
// ============================================================

const props = defineProps<{
  providerName: string
  providerKey: string
}>()

const emit = defineEmits<{
  close: []
  saveSuccess: []
}>()

function openResourceDoc() {
  window.open('/docs/resource-permissions', '_blank')
}

function openResourceKeyDoc() {
  window.open('/docs/resource-key', '_blank')
}

// ============================================================
// State
// ============================================================

const dialogVisible = ref(false)
const isMobile = ref(window.innerWidth < 768)
onMounted(() => window.addEventListener('resize', () => { isMobile.value = window.innerWidth < 768 }))
onUnmounted(() => window.removeEventListener('resize', () => {}))

const loading = ref(false)
const saving = ref(false)
const activeTab = ref('groups')
const activeGroupName = ref('')
const permissionGroups = ref<PermissionGroupDto[]>([])
const treeRefMap = ref<Record<string, any>>({})
const revCounter = ref(0) // triggers reactive recomputation of change counts
const resourcesLoading = ref(false)

// Track original grant state per permission
interface PermState {
  name: string
  originalGranted: boolean
}
const permStateMap = ref<Map<string, PermState>>(new Map())

// ============================================================
// Saved callbacks
// ============================================================

const savedCallbacks: Array<() => void> = []

// ============================================================
// Permission tree
// ============================================================

interface PermissionTreeNode {
  id: string
  label: string
  children?: PermissionTreeNode[]
  isEditable: boolean
  grantedProviders?: ProviderInfoDto[]
}

const treeProps = {
  children: 'children',
  label: 'label',
  disabled: (data: TreeNodeData) => !(data as PermissionTreeNode).isEditable,
}

function buildTree(permissions?: PermissionGrantInfoDto[]): PermissionTreeNode[] {
  if (!permissions || permissions.length === 0) return []

  const nodeMap = new Map<string, PermissionTreeNode>()
  const roots: PermissionTreeNode[] = []

  // First pass: create all nodes
  for (const p of permissions) {
    if (!p.name) continue
    nodeMap.set(p.name, {
      id: p.name,
      label: p.displayName || p.name,
      children: [],
      isEditable: p.isEditable,
      grantedProviders: p.grantedProviders || [],
    })
  }

  // Second pass: build parent-child relationships
  for (const p of permissions) {
    if (!p.name) continue
    const node = nodeMap.get(p.name)
    if (!node) continue

    if (p.parentName && nodeMap.has(p.parentName)) {
      nodeMap.get(p.parentName)!.children!.push(node)
    } else {
      roots.push(node)
    }
  }

  // Clean up empty children arrays
  function clean(nodes: PermissionTreeNode[]) {
    for (const n of nodes) {
      if (n.children && n.children.length === 0) {
        delete n.children
      } else if (n.children) {
        clean(n.children)
      }
    }
  }
  clean(roots)

  return roots
}

function setTreeRef(name: string, el: any) {
  if (el) {
    treeRefMap.value[name] = el
  }
}

function incrementRevision() {
  revCounter.value++
}

/** Collect all checked keys from all trees */
function getAllCheckedKeys(): string[] {
  const keys: string[] = []
  for (const groupName of Object.keys(treeRefMap.value)) {
    const tree = treeRefMap.value[groupName]
    if (tree && typeof tree.getCheckedKeys === 'function') {
      keys.push(...tree.getCheckedKeys())
    }
  }
  return keys
}

// ============================================================
// Change summary (computed reactively via revCounter)
// ============================================================

const grantCount = computed(() => {
  void revCounter.value // 依赖追踪
  const checked = new Set(getAllCheckedKeys())
  let count = 0
  for (const [, state] of permStateMap.value) {
    if (checked.has(state.name) && !state.originalGranted) count++
  }
  return count
})

const revokeCount = computed(() => {
  void revCounter.value
  const checked = new Set(getAllCheckedKeys())
  let count = 0
  for (const [, state] of permStateMap.value) {
    if (!checked.has(state.name) && state.originalGranted) count++
  }
  return count
})

const changeCount = computed(() => grantCount.value + revokeCount.value)

// ============================================================
// Provider badge helpers
// ============================================================

const providerColorMap: Record<string, 'primary' | 'success' | 'warning' | 'info'> = {
  R: 'primary',  // Role → blue
  U: 'success',  // User → green
  T: 'warning',  // Tenant → orange
}

function badgeType(providerName?: string): 'primary' | 'success' | 'warning' | 'info' {
  return providerColorMap[providerName || ''] || 'info'
}

function providerLabel(providerName?: string): string {
  const labels: Record<string, string> = {
    R: 'Role',
    U: 'User',
    T: 'Tenant',
  }
  return labels[providerName || ''] || providerName || 'Unknown'
}

// ============================================================
// Resource permissions state
// ============================================================

type ResourceView = 'list' | 'add' | 'edit'

const resourceView = ref<ResourceView>('list')
const resourcePermissions = ref<ResourcePermissionGrantInfoDto[]>([])
const resourceProviders = ref<ResourceProviderDto[]>([])
const rpAddLevels = ref<ResourcePermissionDefinitionDto[]>([])
const rpSearchResults = ref<SearchProviderKeyInfo[]>([])

const rpSearch = reactive({
  resourceName: '',
  resourceKey: '',
})

const rpAdd = reactive({
  resourceName: '',
  searchQuery: '',
  resourceKey: '',
  permissions: [] as string[],
})

const rpEditItem = ref<ResourcePermissionGrantInfoDto | null>(null)

// ============================================================
// Data loading
// ============================================================

async function loadPermissions() {
  loading.value = true
  try {
    const result = await permissionsApi.getPermissions({
      providerName: props.providerName,
      providerKey: props.providerKey,
    })
    permissionGroups.value = result.groups || []

    // Build permission state map for change tracking
    const map = new Map<string, PermState>()
    for (const group of result.groups || []) {
      for (const p of group.permissions || []) {
        if (p.name) {
          map.set(p.name, { name: p.name, originalGranted: p.isGranted })
        }
      }
    }
    permStateMap.value = map

    if (result.groups && result.groups.length > 0) {
      activeGroupName.value = result.groups[0].name || ''
    }

    // 等待 el-tree 渲染完成后，设置已授权的勾选状态
    await nextTick()
    for (const group of result.groups || []) {
      const tree = treeRefMap.value[group.name!]
      if (tree && typeof tree.setCheckedKeys === 'function') {
        const grantedKeys = (group.permissions || [])
          .filter(p => p.isGranted && p.isEditable)
          .map(p => p.name!)
        tree.setCheckedKeys(grantedKeys)
      }
    }
  } catch (e) {
    console.error('Failed to load permissions', e)
  } finally {
    loading.value = false
  }
}

async function loadResourceProviders() {
  try {
    const result = await permissionsApi.getResourceProviders()
    resourceProviders.value = result.providers || []
  } catch {
    // Resource providers may not be configured
  }
}

// ============================================================
// Resource permissions: search / add / remove
// ============================================================

async function searchResourcePermissions() {
  if (!rpSearch.resourceName || !rpSearch.resourceKey) return
  resourcesLoading.value = true
  try {
    const result = await permissionsApi.getResourcePermissions({
      resourceName: rpSearch.resourceName,
      resourceKey: rpSearch.resourceKey,
    })
    resourcePermissions.value = result.permissions || []
  } catch {
    resourcePermissions.value = []
  } finally {
    resourcesLoading.value = false
  }
}

async function searchRpKeys() {
  if (!rpAdd.resourceName || !rpAdd.searchQuery) return
  try {
    const result = await permissionsApi.searchResourceProviderKeys({
      resourceName: rpAdd.resourceName,
      filter: rpAdd.searchQuery,
    })
    rpSearchResults.value = result.keys || []
  } catch {
    rpSearchResults.value = []
  }
}

async function onRpAddTypeChange() {
  rpAdd.resourceKey = ''
  rpAdd.searchQuery = ''
  rpAdd.permissions = []
  rpSearchResults.value = []
  rpAddLevels.value = []
  if (rpAdd.resourceName) {
    try {
      const result = await permissionsApi.getResourcePermissionDefinitions({
        resourceName: rpAdd.resourceName,
      })
      rpAddLevels.value = result.permissions || []
    } catch {
      rpAddLevels.value = []
    }
  }
}

async function onRpResourceTypeChange() {
  rpSearch.resourceKey = ''
  resourcePermissions.value = []
}

function showResourceAdd() {
  resourceView.value = 'add'
}

function cancelResourceAdd() {
  resourceView.value = 'list'
  rpAdd.resourceName = ''
  rpAdd.searchQuery = ''
  rpAdd.resourceKey = ''
  rpAdd.permissions = []
  rpSearchResults.value = []
  rpAddLevels.value = []
}

function showResourceEdit(row: ResourcePermissionGrantInfoDto) {
  rpEditItem.value = row
  resourceView.value = 'edit'
}

async function confirmAddResourcePermission() {
  if (!rpAdd.resourceKey || !rpAdd.permissions.length) return
  saving.value = true
  try {
    await permissionsApi.updateResourcePermissions(
      {
        providerName: props.providerName,
        providerKey: props.providerKey,
        permissions: rpAdd.permissions,
      },
      {
        resourceName: rpAdd.resourceName,
        resourceKey: rpAdd.resourceKey,
      },
    )
    // Refresh list with current search params
    rpSearch.resourceName = rpAdd.resourceName
    rpSearch.resourceKey = rpAdd.resourceKey
    resourceView.value = 'list'
    await searchResourcePermissions()
    cancelResourceAdd()
  } catch {
    // Error handled by HTTP interceptor
  } finally {
    saving.value = false
  }
}

async function removeResourcePermission(row: ResourcePermissionGrantInfoDto) {
  const { ElMessageBox } = await import('element-plus')
  try {
    await ElMessageBox.confirm(
      `确定移除资源 "${row.providerKey}" 的权限吗？`,
      '确认删除',
      { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' },
    )
  } catch {
    return
  }

  saving.value = true
  try {
    const resourceName = rpSearch.resourceName
    const resourceKey = rpSearch.resourceKey
    await permissionsApi.deleteResourcePermission({
      resourceName,
      resourceKey,
      providerName: row.providerName,
      providerKey: row.providerKey,
    })
    await searchResourcePermissions()
    resourceView.value = 'list'
  } catch {
    // Error handled by HTTP interceptor
  } finally {
    saving.value = false
  }
}

// ============================================================
// Save permission tree changes
// ============================================================

async function handleSave() {
  saving.value = true
  try {
    const checkedKeys = new Set(getAllCheckedKeys())
    const changedPerms: UpdatePermissionDto[] = []

    for (const [, state] of permStateMap.value) {
      const isNowGranted = checkedKeys.has(state.name)
      if (isNowGranted !== state.originalGranted) {
        changedPerms.push({ name: state.name, isGranted: isNowGranted })
      }
    }

    if (changedPerms.length > 0) {
      await permissionsApi.updatePermissions(
        { permissions: changedPerms },
        { providerName: props.providerName, providerKey: props.providerKey },
      )
    }

    // Fire saved callbacks
    for (const cb of savedCallbacks) {
      try { cb() } catch { /* swallow callback errors */ }
    }

    emit('saveSuccess')
    dialogVisible.value = false
  } catch {
    // Error handled by HTTP interceptor
  } finally {
    saving.value = false
  }
}

// ============================================================
// Dialog lifecycle
// ============================================================

async function handleOpen() {
  await loadPermissions()
  await loadResourceProviders()
}

function handleCancel() {
  dialogVisible.value = false
  emit('close')
}

async function handleBeforeClose(done: () => void) {
  if (changeCount.value > 0) {
    const { ElMessageBox } = await import('element-plus')
    try {
      await ElMessageBox.confirm(
        '有未保存的更改，确定关闭吗？',
        '提示',
        { confirmButtonText: '确定关闭', cancelButtonText: '取消', type: 'warning' },
      )
      done()
    } catch {
      // cancelled
    }
  } else {
    done()
  }
}

// ============================================================
// Imperative API exposed to parent
// ============================================================

function open() {
  dialogVisible.value = true
}

function close() {
  dialogVisible.value = false
}

function registerSavedCallback(cb: () => void) {
  savedCallbacks.push(cb)
}

defineExpose({
  open,
  close,
  onSaved: registerSavedCallback,
})
</script>

<style scoped>
.permission-modal-body {
  min-height: 300px;
}

.group-tabs {
  height: 400px;
}

.group-tabs :deep(.el-tab-pane) {
  height: 100%;
  overflow-y: auto;
}

.permission-node {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.permission-label {
  font-size: 13px;
}

.grant-badges {
  display: inline-flex;
  gap: 4px;
}

.grant-tag {
  font-size: 11px;
}

.change-summary {
  padding: 8px 16px;
  border-top: 1px solid var(--el-border-color-light);
  font-size: 13px;
}

.change-grant {
  color: var(--el-color-success);
}

.change-revoke {
  color: var(--el-color-danger);
}

.change-sep {
  margin: 0 6px;
  color: var(--el-text-color-secondary);
}

.rp-toolbar {
  margin-bottom: 8px;
}

.rp-search-form {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--el-border-color-light);
}

.rp-section-title {
  margin: 0 0 16px;
  font-size: 14px;
  font-weight: 600;
}

.rp-form {
  max-width: 600px;
}

.rp-resource-type-item {
  width: 100%;
}

.rp-resource-type-item :deep(.el-form-item__content) {
  flex: 1;
}

.tab-help-icon,
.label-help-icon {
  margin-left: 4px;
  font-size: 14px;
  cursor: pointer;
  color: var(--el-text-color-secondary);
}

.resource-permissions-panel {
  min-height: 200px;
}
</style>
