<template>
  <el-tooltip v-if="showTooltip" :content="fullDate" placement="top" :show-after="500">
    <span>{{ displayDate }}</span>
  </el-tooltip>
  <span v-else>{{ displayDate }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatDateCell, type DateRenderMode } from '@/utils/date-format'

const props = withDefaults(defineProps<{
  /** 日期原始值（字符串 / 数字 / Date） */
  date: unknown
  /** 渲染模式 */
  mode?: DateRenderMode
}>(), {
  mode: 'combined',
})

const displayDate = computed(() => formatDateCell(props.date, props.mode))
const fullDate = computed(() => formatDateCell(props.date, 'full'))
/** 仅 relative 模式且未回退到完整日期时显示 tooltip */
const showTooltip = computed(() => props.mode === 'relative' && displayDate.value !== fullDate.value)
</script>
