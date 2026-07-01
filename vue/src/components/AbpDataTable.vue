<template>
  <div class="abp-data-table">
    <!-- 工具栏：搜索 + 列可见性 + 操作区 -->
    <div class="flex items-center justify-between mb-4 flex-wrap gap-2">
      <div class="flex items-center gap-2">
        <el-input v-if="searchable" v-model="searchText" :placeholder="searchPlaceholder"
          clearable class="w-56" @input="onSearchInput" @clear="onSearchClear">
          <template #prefix><el-icon><Search /></el-icon></template>
        </el-input>
        <slot name="toolbar-actions" />
      </div>
      <div class="flex items-center gap-2">
        <el-popover v-if="columns.length > 0" placement="bottom-end" :width="280" trigger="hover">
          <template #reference>
            <el-button size="small" plain title="列设置"><el-icon><Operation /></el-icon></el-button>
          </template>
          <div class="column-settings">
            <el-checkbox-group v-model="visibleColumns">
              <div v-for="col in columns" :key="col.prop" class="col-setting-item">
                <div class="flex items-center justify-between">
                  <el-checkbox :label="col.prop" :value="col.prop">{{ col.label }}</el-checkbox>
                  <div v-if="columnWidths[col.prop]" class="flex items-center gap-1">
                    <span class="text-xs text-gray-400">{{ columnWidths[col.prop] }}</span>
                    <el-button size="small" text type="danger" title="重置此列宽" @click="resetColWidth(col.prop)">
                      <el-icon :size="12"><Delete /></el-icon>
                    </el-button>
                  </div>
                </div>
                <div v-if="col.dateRender && visibleColumns.includes(col.prop)" class="ml-6 mt-1">
                  <el-radio-group
                    :model-value="dateRenderFormats[col.prop] || 'full'"
                    size="small"
                    @change="(v: string) => setDateRenderFormat(col.prop, v as DateRenderMode)"
                  >
                    <el-radio-button v-for="m in DATE_RENDER_MODES" :key="m.value" :value="m.value">
                      {{ m.label }}
                    </el-radio-button>
                  </el-radio-group>
                  <p class="text-xs text-gray-400 mt-1">
                    示例：{{ DATE_RENDER_MODES.find((m) => m.value === (dateRenderFormats[col.prop] || 'full'))?.example }}
                  </p>
                </div>
              </div>
            </el-checkbox-group>
            <!-- 操作列：不可隐藏，仅在手动调整列宽后显示 -->
            <div v-if="$slots.actions && columnWidths['__actions__']" class="col-setting-item">
              <div class="flex items-center justify-between">
                <span class="text-sm">操作</span>
                <div class="flex items-center gap-1">
                  <span class="text-xs text-gray-400">{{ columnWidths['__actions__'] }}</span>
                  <el-button size="small" text type="primary" title="重置列宽" @click="resetColWidth('__actions__')">
                    <el-icon :size="12"><Refresh /></el-icon>
                  </el-button>
                </div>
              </div>
            </div>
            <el-divider />
            <el-button size="small" plain title="清除所有手动调整的列宽，恢复默认" @click="clearColWidths">重置所有列宽</el-button>
          </div>
        </el-popover>
      </div>
    </div>

    <!-- 表格主体 -->
    <div class="overflow-x-auto">
      <el-table
        :data="loading && !initialLoadDone ? [] : items"
        v-loading="loading"
        :element-loading-text="'加载中...'"
        :default-sort="{ prop: defaultSortProp, order: 'descending' }"
        @sort-change="onSortChange"
        @selection-change="$emit('selection-change', $event)"
        @header-dragend="onHeaderDragEnd"
        stripe border
        :row-key="rowKey"
        :max-height="maxHeight"
      >
        <el-table-column v-if="selectable" type="selection" width="50" />
        <template v-for="col in filteredColumns" :key="col.prop">
          <el-table-column
            :prop="col.prop"
            :label="col.label"
            :width="colResizedWidth(col)"
            :min-width="col.minWidth || '80'"
            :sortable="col.sortable !== false ? 'custom' : false"
            :class-name="col.hideOnMobile ? 'hide-on-mobile' : undefined"
            :resizable="true"
            align="center"
          >
            <template #default="scope">
              <slot :name="`cell-${col.prop}`" :row="scope.row" :$index="scope.$index" :column="col">
                <DateTimeCell v-if="col.dateRender" :date="scope.row[col.prop]" :mode="dateRenderFormats[col.prop] || 'full'" />
                <template v-else>{{ col.formatter ? col.formatter(scope.row, scope.column, scope.row[col.prop], scope.$index) : scope.row[col.prop] }}</template>
              </slot>
            </template>
          </el-table-column>
        </template>
        <el-table-column v-if="$slots.actions" label="操作" :width="actionsColWidth" fixed="right" align="center" class-name="actions-column">
          <template #default="scope">
            <slot name="actions" :row="scope.row" :$index="scope.$index" />
          </template>
        </el-table-column>
        <!-- 加载骨架 -->
        <template v-if="loading && !initialLoadDone" #empty>
          <el-skeleton :rows="5" animated />
        </template>
        <!-- 空状态 -->
        <template v-if="!loading && totalCount === 0" #empty>
          <AbpEmptyState :type="searchText ? 'no-results' : 'empty'" />
        </template>
      </el-table>
    </div>

    <!-- 分页 -->
    <div v-if="paginated && totalCount > 0" class="flex justify-end mt-4">
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="pageSizes"
        :total="totalCount"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="onPageSizeChange"
        @current-change="onPageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Search, Operation, Delete, Refresh } from '@element-plus/icons-vue'
import HTTPClient from '@/api/http'
import type { PagedResultDto, PagedRequestDto } from '@/types/api'
import AbpEmptyState from './AbpEmptyState.vue'
import DateTimeCell from './DateTimeCell.vue'
import { DATE_RENDER_MODES, type DateRenderMode } from '@/utils/date-format'

interface ColumnDef {
  prop: string; label: string; width?: string; minWidth?: string
  sortable?: boolean; formatter?: (row: unknown, col: unknown, cell: unknown, idx: number) => string
  hideOnMobile?: boolean
  /** 标记为日期列 — 列设置中可切换渲染格式 */
  dateRender?: boolean
}

const props = withDefaults(defineProps<{
  columns: ColumnDef[]
  api: ((params: PagedRequestDto) => Promise<PagedResultDto<unknown>>) | string
  searchable?: boolean
  searchPlaceholder?: string
  paginated?: boolean
  pageSizes?: number[]
  defaultSortProp?: string
  rowKey?: string
  selectable?: boolean
  maxHeight?: string | number
  actionsWidth?: string
  /** localStorage key — 提供后分页大小会持久化 */
  storageKey?: string
}>(), {
  searchable: true,
  searchPlaceholder: '搜索...',
  paginated: true,
  pageSizes: () => [10, 20, 50, 100],
  defaultSortProp: 'creationTime',
  rowKey: 'id',
  selectable: false,
  maxHeight: undefined,
  actionsWidth: '240',
})

defineEmits<{ 'selection-change': [v: unknown[]] }>()

// 状态
const items = ref<any[]>([])
const totalCount = ref(0)
const loading = ref(false)
const initialLoadDone = ref(false)
const searchText = ref('')
const STORAGE_PREFIX = 'abp:page-size:'

function loadPageSize(): number {
  if (!props.storageKey) return props.pageSizes[0]
  try {
    const saved = localStorage.getItem(STORAGE_PREFIX + props.storageKey)
    const n = saved ? parseInt(saved, 10) : 0
    return props.pageSizes.includes(n) ? n : props.pageSizes[0]
  } catch { return props.pageSizes[0] }
}

function savePageSize(size: number) {
  if (!props.storageKey) return
  try { localStorage.setItem(STORAGE_PREFIX + props.storageKey, String(size)) } catch { /* quota exceeded */ }
}

// 日期列渲染格式 — 按 prop 存储，localStorage 持久化
const DATERENDER_KEY = 'abp:date-render:'

const dateRenderFormats = ref<Record<string, DateRenderMode>>({})

function loadDateFormats() {
  if (!props.storageKey) return
  const dateCols = props.columns.filter((c) => c.dateRender)
  for (const col of dateCols) {
    try {
      const saved = localStorage.getItem(DATERENDER_KEY + props.storageKey + ':' + col.prop) as DateRenderMode | null
      dateRenderFormats.value[col.prop] = saved && DATE_RENDER_MODES.some((m) => m.value === saved) ? saved : 'full'
    } catch { dateRenderFormats.value[col.prop] = 'full' }
  }
}

function setDateRenderFormat(prop: string, mode: DateRenderMode) {
  dateRenderFormats.value[prop] = mode
  if (!props.storageKey) return
  try { localStorage.setItem(DATERENDER_KEY + props.storageKey + ':' + prop, mode) } catch { /* quota */ }
}

loadDateFormats()

// 列宽持久化
const COLWIDTH_KEY = 'abp:col-width:'
const columnWidths = ref<Record<string, string>>({})

function loadColWidths() {
  if (!props.storageKey) return
  for (const col of props.columns) {
    try {
      const saved = localStorage.getItem(COLWIDTH_KEY + props.storageKey + ':' + col.prop)
      if (saved) columnWidths.value[col.prop] = saved
    } catch { /* */ }
  }
  // 操作列宽
  try {
    const saved = localStorage.getItem(COLWIDTH_KEY + props.storageKey + ':__actions__')
    if (saved) columnWidths.value['__actions__'] = saved
  } catch { /* */ }
}
loadColWidths()

function saveColWidth(prop: string, width: string) {
  columnWidths.value[prop] = width
  if (!props.storageKey) return
  try { localStorage.setItem(COLWIDTH_KEY + props.storageKey + ':' + prop, width) } catch { /* */ }
}

function resetColWidth(prop: string) {
  if (!props.storageKey) return
  try { localStorage.removeItem(COLWIDTH_KEY + props.storageKey + ':' + prop) } catch { /* */ }
  delete columnWidths.value[prop]
  // 触发响应式更新
  columnWidths.value = { ...columnWidths.value }
}

function clearColWidths() {
  if (!props.storageKey) return
  for (const col of props.columns) {
    try { localStorage.removeItem(COLWIDTH_KEY + props.storageKey + ':' + col.prop) } catch { /* */ }
  }
  try { localStorage.removeItem(COLWIDTH_KEY + props.storageKey + ':__actions__') } catch { /* */ }
  columnWidths.value = {}
}

function colResizedWidth(col: ColumnDef): string | undefined {
  return columnWidths.value[col.prop] || col.width || undefined
}

const actionsColWidth = computed(() => columnWidths.value['__actions__'] || props.actionsWidth)

// Element Plus 原生列宽拖拽事件
function onHeaderDragEnd(newWidth: number, _oldWidth: number, column: { property?: string }) {
  const key = column.property || '__actions__'
  saveColWidth(key, newWidth + 'px')
}

const currentPage = ref(1)
const pageSize = ref(loadPageSize())
const sortProp = ref<string | null>(null)
const sortOrder = ref<'asc' | 'desc' | null>(null)
const visibleColumns = ref<string[]>(props.columns.map((c) => c.prop))

// 计算
const filteredColumns = computed(() => props.columns.filter((c) => visibleColumns.value.includes(c.prop)))
let debounceTimer: ReturnType<typeof setTimeout> | null = null

// 加载数据
async function loadData() {
  loading.value = true
  try {
    const params: PagedRequestDto = { maxResultCount: pageSize.value, skipCount: (currentPage.value - 1) * pageSize.value }
    if (searchText.value) params.filter = searchText.value
    if (sortProp.value) params.sorting = `${sortProp.value} ${sortOrder.value}`

    const result = typeof props.api === 'string'
      ? (await HTTPClient.get<PagedResultDto<unknown>>(props.api as string, { params })).data
      : await (props.api as (p: PagedRequestDto) => Promise<PagedResultDto<unknown>>)(params)

    items.value = result.items || []
    totalCount.value = result.totalCount
    initialLoadDone.value = true
  } finally {
    loading.value = false
  }
}

// 搜索防抖
function onSearchInput() {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => { currentPage.value = 1; loadData() }, 300)
}
function onSearchClear() { searchText.value = ''; currentPage.value = 1; loadData() }

// 排序
function onSortChange(sort: { prop: string | null; order: 'ascending' | 'descending' | null }) {
  sortProp.value = sort.prop
  sortOrder.value = sort.order === 'ascending' ? 'asc' : sort.order === 'descending' ? 'desc' : null
  loadData()
}

// 分页
function onPageChange(p: number) { currentPage.value = p; loadData() }
function onPageSizeChange(s: number) { pageSize.value = s; savePageSize(s); currentPage.value = 1; loadData() }

// 初始化
onMounted(() => loadData())

// 暴露刷新方法
defineExpose({ loadData, refresh: loadData })
</script>

<style scoped>
.abp-data-table { width: 100%; }

/* 排序箭头脱离文档流，列头居中时不受其宽度影响 */
:deep(.el-table__header-wrapper .caret-wrapper) {
  position: absolute;
  right: 2px;
  top: 50%;
  transform: translateY(-50%);
}

/* 操作列根据内容自适应宽度，不换行 */
:deep(.actions-column .cell) {
  display: flex;
  flex-wrap: nowrap;
  gap: 4px;
  justify-content: center;
}

.col-setting-item {
  padding: 2px 0;
}

@media (max-width: 767px) {
  :deep(.hide-on-mobile) {
    display: none;
  }
}
</style>
