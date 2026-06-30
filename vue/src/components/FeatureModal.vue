<template>
  <el-dialog
    v-model="dialogVisible"
    title="功能管理"
    width="800px"
    :close-on-click-modal="false"
    :before-close="handleBeforeClose"
    @open="handleOpen"
    destroy-on-close
  >
    <div v-loading="loading" class="feature-modal-body">
      <AbpEmptyState v-if="!loading && featureGroups.length === 0" />

      <el-tabs v-model="activeGroupName" v-else>
        <el-tab-pane
          v-for="group in featureGroups"
          :key="group.name"
          :label="group.displayName || group.name"
          :name="group.name!"
        >
          <el-tree
            :ref="(el: any) => setTreeRef(group.name!, el)"
            :data="buildTreeData(group.features || [])"
            :props="treeProps"
            node-key="name"
            default-expand-all
            :expand-on-click-node="false"
          >
            <template #default="{ data }">
              <div class="feature-node">
                <span class="feature-label">{{ data.displayName || data.name }}</span>

                <!-- ToggleStringValueType -->
                <el-switch
                  v-if="data.valueTypeName === 'ToggleStringValueType'"
                  :model-value="data.currentValue === 'true'"
                  :disabled="data._disabled"
                  @change="(v: boolean) => onToggleChange(data, v)"
                  style="margin-left: auto;"
                />

                <!-- FreeTextStringValueType -->
                <el-input
                  v-else-if="data.valueTypeName === 'FreeTextStringValueType'"
                  :model-value="data.currentValue"
                  :disabled="data._disabled"
                  @change="(v: string) => onTextChange(data, v)"
                  size="small"
                  style="margin-left: auto; width: 220px;"
                />

                <!-- SelectionStringValueType -->
                <el-select
                  v-else-if="data.valueTypeName === 'SelectionStringValueType'"
                  :model-value="data.currentValue"
                  :disabled="data._disabled"
                  @change="(v: string) => onSelectChange(data, v)"
                  size="small"
                  style="margin-left: auto; width: 220px;"
                >
                  <el-option
                    v-for="opt in data._options"
                    :key="opt.value"
                    :label="opt.label"
                    :value="opt.value"
                  />
                </el-select>

                <!-- Fallback: display raw value -->
                <el-tag v-else size="small" style="margin-left: auto;">{{ data.currentValue || '-' }}</el-tag>
              </div>
            </template>
          </el-tree>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- Change summary -->
    <div v-if="dirtyCount > 0" class="change-summary">
      已修改 {{ dirtyCount }} 项功能设置
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
import { ref, computed } from 'vue'
import * as featureApi from '@/api/feature'
import type {
  FeatureGroupDto,
  FeatureDto,
  UpdateFeatureDto,
} from '@/types/feature'

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

// ============================================================
// State
// ============================================================

const dialogVisible = ref(false)
const loading = ref(false)
const saving = ref(false)
const activeGroupName = ref('')
const featureGroups = ref<FeatureGroupDto[]>([])
const treeRefMap = ref<Record<string, any>>({})

// Track original values for change detection
const originalValues = ref<Map<string, string>>(new Map())
// Track current edited values
const currentValues = ref<Map<string, string>>(new Map())
// Force re-render counter (for cascade disabled state)
const renderKey = ref(0)

// ============================================================
// Saved callbacks
// ============================================================

const savedCallbacks: Array<() => void> = []

// ============================================================
// Feature tree node (augmented)
// ============================================================

interface FeatureTreeNode {
  name: string
  displayName?: string | null
  children?: FeatureTreeNode[]
  valueTypeName: string
  currentValue: string
  _disabled: boolean
  _options?: Array<{ label: string; value: string }>
  _original?: FeatureDto
}

const treeProps = {
  children: 'children',
  label: 'displayName',
}

/**
 * Determine value type short name from IStringValueType.name
 */
function resolveValueTypeName(dto: FeatureDto): string {
  const name = dto.valueType?.name || ''
  if (name.includes('Toggle')) return 'ToggleStringValueType'
  if (name.includes('FreeText')) return 'FreeTextStringValueType'
  if (name.includes('Selection')) return 'SelectionStringValueType'
  return name
}

/**
 * Extract selection options from valueType.properties
 */
function extractOptions(dto: FeatureDto): Array<{ label: string; value: string }> {
  const props2 = dto.valueType?.properties || {}
  const items = (props2 as Record<string, unknown>).items as Array<Record<string, unknown>> | undefined
  if (!items || !Array.isArray(items)) return []
  return items.map((item: Record<string, unknown>) => ({
    label: String(item.name || item.value || item),
    value: String(item.value || item.name || item),
  }))
}

/**
 * Build tree from flat feature list using parentName relationships
 */
function buildTreeData(features: FeatureDto[]): FeatureTreeNode[] {
  if (!features || features.length === 0) return []

  const nodeMap = new Map<string, FeatureTreeNode>()
  const roots: FeatureTreeNode[] = []

  // Sort by depth so parents come before children
  const sorted = [...features].sort((a, b) => a.depth - b.depth)

  for (const f of sorted) {
    if (!f.name) continue

    const currentVal = currentValues.value.get(f.name) ?? f.value ?? ''
    const valueTypeName = resolveValueTypeName(f)

    const node: FeatureTreeNode = {
      name: f.name,
      displayName: f.displayName || f.name,
      children: [],
      valueTypeName,
      currentValue: currentVal,
      _disabled: false,
      _options: valueTypeName === 'SelectionStringValueType' ? extractOptions(f) : undefined,
      _original: f,
    }

    nodeMap.set(f.name, node)

    if (f.parentName && nodeMap.has(f.parentName)) {
      nodeMap.get(f.parentName)!.children!.push(node)
    } else {
      roots.push(node)
    }
  }

  // Clean up empty children arrays and apply cascade disabled
  function postProcess(nodes: FeatureTreeNode[], parentDisabled: boolean) {
    for (const n of nodes) {
      if (n.children && n.children.length === 0) {
        delete n.children
      }
      // Cascade: parent toggle off → children disabled
      if (n.valueTypeName === 'ToggleStringValueType') {
        n._disabled = parentDisabled || n.currentValue !== 'true'
      } else {
        n._disabled = parentDisabled
      }
      if (n.children) {
        postProcess(n.children, n._disabled)
      }
    }
  }
  postProcess(roots, false)

  return roots
}

function setTreeRef(name: string, el: unknown) {
  if (el) {
    treeRefMap.value[name] = el
  }
}

// ============================================================
// Value change handlers
// ============================================================

function onToggleChange(node: FeatureTreeNode, value: boolean) {
  node.currentValue = value ? 'true' : 'false'
  currentValues.value.set(node.name, node.currentValue)
  // When toggling off a parent, auto-disable children via re-render
  triggerRerender()
}

function onTextChange(node: FeatureTreeNode, value: string) {
  node.currentValue = value
  currentValues.value.set(node.name, value)
}

function onSelectChange(node: FeatureTreeNode, value: string) {
  node.currentValue = value
  currentValues.value.set(node.name, value)
}

function triggerRerender() {
  renderKey.value++
}

// ============================================================
// Dirty tracking
// ============================================================

const dirtyCount = computed(() => {
  void renderKey.value // dependency tracking
  let count = 0
  for (const [name, orig] of originalValues.value) {
    const current = currentValues.value.get(name) ?? orig
    if (current !== orig) count++
  }
  return count
})

// ============================================================
// Data loading
// ============================================================

async function loadFeatures() {
  loading.value = true
  try {
    const result = await featureApi.getFeatures({
      providerName: props.providerName,
      providerKey: props.providerKey,
    })

    featureGroups.value = result.groups || []

    // Reset tracking maps
    const newOriginals = new Map<string, string>()
    const newCurrents = new Map<string, string>()

    for (const group of result.groups || []) {
      for (const f of group.features || []) {
        if (f.name) {
          const val = f.value ?? ''
          newOriginals.set(f.name, val)
          newCurrents.set(f.name, val)
        }
      }
    }

    originalValues.value = newOriginals
    currentValues.value = newCurrents

    if (result.groups && result.groups.length > 0) {
      activeGroupName.value = result.groups[0].name || ''
    }
  } catch (e) {
    console.error('Failed to load features', e)
  } finally {
    loading.value = false
  }
}

// ============================================================
// Save
// ============================================================

async function handleSave() {
  saving.value = true
  try {
    const changedFeatures: UpdateFeatureDto[] = []
    for (const [name, orig] of originalValues.value) {
      const current = currentValues.value.get(name) ?? orig
      if (current !== orig) {
        changedFeatures.push({ name, value: current })
      }
    }

    if (changedFeatures.length > 0) {
      await featureApi.updateFeatures(
        { features: changedFeatures },
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
  renderKey.value = 0
  await loadFeatures()
}

function handleCancel() {
  dialogVisible.value = false
  emit('close')
}

async function handleBeforeClose(done: () => void) {
  if (dirtyCount.value > 0) {
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
.feature-modal-body {
  min-height: 300px;
}

.feature-node {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding-right: 8px;
}

.feature-label {
  font-size: 13px;
  white-space: nowrap;
}

.change-summary {
  padding: 8px 16px;
  border-top: 1px solid var(--el-border-color-light);
  font-size: 13px;
  color: var(--el-color-warning);
}
</style>
