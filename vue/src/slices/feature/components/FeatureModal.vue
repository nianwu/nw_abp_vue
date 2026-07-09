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
          <!-- 扁平表单布局（替代 el-tree）—— 每条功能一行 -->
          <div
            v-for="row in buildFlatRows(group.features || [])"
            :key="row.name"
            class="feature-row"
            :class="{ 'feature-row--child': !!row.parentName }"
          >
            <div class="feature-row__info">
              <span class="feature-label">{{ row.displayName || row.name }}</span>
              <span v-if="row.description" class="feature-desc">{{ row.description }}</span>
            </div>

            <div class="feature-row__control">
              <!-- Toggle -->
              <el-switch
                v-if="row._valueTypeName === 'ToggleStringValueType'"
                :model-value="row._currentValue === 'true'"
                :disabled="row._disabled"
                @change="(v: boolean) => onToggleChange(row, v)"
              />

              <!-- Free text -->
              <el-input
                v-else-if="row._valueTypeName === 'FreeTextStringValueType'"
                :model-value="row._currentValue"
                :disabled="row._disabled"
                @change="(v: string) => onTextChange(row, v)"
                style="width: 220px;"
              />

              <!-- Selection (dropdown) -->
              <el-select
                v-else-if="row._valueTypeName === 'SelectionStringValueType'"
                :model-value="row._currentValue"
                :disabled="row._disabled"
                @change="(v: string) => onSelectChange(row, v)"
                style="width: 220px;"
              >
                <el-option
                  v-for="opt in row._options"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
                >
                  <div class="select-option">
                    <span>{{ opt.label }}</span>
                    <span v-if="opt.desc" class="select-option__desc">{{ opt.desc }}</span>
                  </div>
                </el-option>
              </el-select>

              <!-- Fallback -->
              <el-tag v-else size="small">{{ row._currentValue || '-' }}</el-tag>
            </div>
          </div>
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

// Track original values for change detection
const originalValues = ref<Map<string, string>>(new Map())
// Track current edited values
const currentValues = ref<Map<string, string>>(new Map())

// ============================================================
// Saved callbacks
// ============================================================

const savedCallbacks: Array<() => void> = []

// ============================================================
// Flat row augment — 扁平化功能行（无树形嵌套）
// ============================================================

interface FlatFeatureRow {
  name: string
  displayName?: string | null
  description?: string | null
  parentName?: string | null
  _valueTypeName: string
  _currentValue: string
  _disabled: boolean
  _options?: Array<{ label: string; value: string; desc?: string }>
}

/** 解析值类型短名 */
function resolveValueTypeName(dto: FeatureDto): string {
  const name = dto.valueType?.name || ''
  if (name.includes('Toggle')) return 'ToggleStringValueType'
  if (name.includes('FreeText')) return 'FreeTextStringValueType'
  if (name.includes('Selection')) return 'SelectionStringValueType'
  return name
}

/** 提取下拉选项 */
function extractOptions(dto: FeatureDto): Array<{ label: string; value: string; desc?: string }> {
  const props2 = dto.valueType?.properties || {}
  const items = (props2 as Record<string, unknown>).items as Array<Record<string, unknown>> | undefined
  if (!items || !Array.isArray(items)) return []
  return items.map((item: Record<string, unknown>) => ({
    label: String(item.name || item.value || item),
    value: String(item.value || item.name || item),
    desc: item.desc ? String(item.desc) : undefined,
  }))
}

/**
 * 构建扁平行列表（替代树形结构）
 *
 * 按 depth 排序，parent 在前 child 在后。
 * child 在 parent toggle 关闭时自动 disabled。
 */
function buildFlatRows(features: FeatureDto[]): FlatFeatureRow[] {
  if (!features || features.length === 0) return []

  const sorted = [...features].sort((a, b) => a.depth - b.depth)
  const parentStates = new Map<string, boolean>() // parentName → isOn

  return sorted
    .filter((f) => !!f.name)
    .map((f) => {
      const currentVal = currentValues.value.get(f.name!) ?? f.value ?? ''
      const typeName = resolveValueTypeName(f)

      // 父级 toggle 关闭时，子节点 disabled
      const parentDisabled = f.parentName ? !parentStates.get(f.parentName) : false

      const row: FlatFeatureRow = {
        name: f.name!,
        displayName: f.displayName,
        description: f.description,
        parentName: f.parentName,
        _valueTypeName: typeName,
        _currentValue: currentVal,
        _disabled: parentDisabled,
        _options:
          typeName === 'SelectionStringValueType' ? extractOptions(f) : undefined,
      }

      // 记录本节点 toggle 状态，供后续子节点判断
      if (typeName === 'ToggleStringValueType') {
        parentStates.set(f.name!, currentVal === 'true')
      }

      return row
    })
}

// ============================================================
// Value change handlers
// ============================================================

function onToggleChange(row: FlatFeatureRow, value: boolean) {
  currentValues.value.set(row.name, value ? 'true' : 'false')
}

function onTextChange(row: FlatFeatureRow, value: string) {
  currentValues.value.set(row.name, value)
}

function onSelectChange(row: FlatFeatureRow, value: string) {
  currentValues.value.set(row.name, value)
}

// ============================================================
// Dirty tracking
// ============================================================

const dirtyCount = computed(() => {
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

    for (const cb of savedCallbacks) {
      try { cb() } catch { /* swallow */ }
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
// Imperative API
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

.feature-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 12px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.feature-row:last-child {
  border-bottom: none;
}

.feature-row--child {
  padding-left: 32px;
  background: var(--el-fill-color-light);
}

.feature-row__info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.feature-label {
  font-size: 13px;
  font-weight: 500;
}

.feature-desc {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.feature-row__control {
  flex-shrink: 0;
}

.change-summary {
  padding: 8px 16px;
  border-top: 1px solid var(--el-border-color-light);
  font-size: 13px;
  color: var(--el-color-warning);
}

/* 下拉选项带说明文字 */
.select-option {
  display: flex;
  flex-direction: column;
  gap: 2px;
  line-height: 1.4;
}

.select-option__desc {
  font-size: 11px;
  color: var(--el-text-color-placeholder);
}
</style>
