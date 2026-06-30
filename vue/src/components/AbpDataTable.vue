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
        <el-popover v-if="columns.length > 0" placement="bottom-end" :width="200" trigger="click">
          <template #reference>
            <el-button size="small" plain><el-icon><Operation /></el-icon></el-button>
          </template>
          <el-checkbox-group v-model="visibleColumns">
            <div v-for="col in columns" :key="col.prop" class="py-1">
              <el-checkbox :label="col.prop" :value="col.prop">{{ col.label }}</el-checkbox>
            </div>
          </el-checkbox-group>
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
        stripe border
        :row-key="rowKey"
        :max-height="maxHeight"
      >
        <el-table-column v-if="selectable" type="selection" width="50" />
        <template v-for="col in filteredColumns" :key="col.prop">
          <el-table-column
            :prop="col.prop"
            :label="col.label"
            :width="col.width"
            :min-width="col.minWidth"
            :sortable="col.sortable !== false ? 'custom' : false"
          >
            <template #default="scope">
              <slot :name="`cell-${col.prop}`" :row="scope.row" :$index="scope.$index" :column="col">
                {{ col.formatter ? col.formatter(scope.row, scope.column, scope.row[col.prop], scope.$index) : scope.row[col.prop] }}
              </slot>
            </template>
          </el-table-column>
        </template>
        <el-table-column v-if="$slots.actions" label="操作" :width="actionsWidth" fixed="right">
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
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
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
import { Search, Operation } from '@element-plus/icons-vue'
import HTTPClient from '@/api/http'
import type { PagedResultDto, PagedRequestDto } from '@/types/api'
import AbpEmptyState from './AbpEmptyState.vue'

interface ColumnDef {
  prop: string; label: string; width?: string; minWidth?: string
  sortable?: boolean; formatter?: (row: unknown, col: unknown, cell: unknown, idx: number) => string
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
}>(), {
  searchable: true,
  searchPlaceholder: '搜索...',
  paginated: true,
  pageSizes: () => [10, 20, 50, 100],
  defaultSortProp: 'creationTime',
  rowKey: 'id',
  selectable: false,
  maxHeight: undefined,
  actionsWidth: '180',
})

defineEmits<{ 'selection-change': [v: unknown[]] }>()

// 状态
const items = ref<any[]>([])
const totalCount = ref(0)
const loading = ref(false)
const initialLoadDone = ref(false)
const searchText = ref('')
const currentPage = ref(1)
const pageSize = ref(props.pageSizes[0])
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
function onPageSizeChange(s: number) { pageSize.value = s; currentPage.value = 1; loadData() }

// 初始化
onMounted(() => loadData())

// 暴露刷新方法
defineExpose({ loadData, refresh: loadData })
</script>

<style scoped>
.abp-data-table { width: 100%; }
</style>
