<template>
  <div class="flex flex-col items-center justify-center py-12">
    <el-empty :description="description" :image-size="120">
      <template v-if="type === 'empty' && createLabel" #default>
        <el-button type="primary" @click="$emit('create')">{{ createLabel }}</el-button>
      </template>
    </el-empty>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  type: 'empty' | 'no-results' | 'no-options'
  createLabel?: string
}>(), { type: 'empty' })

defineEmits<{ create: [] }>()

const description = computed(() => {
  switch (props.type) {
    case 'empty': return '暂无数据'
    case 'no-results': return '未找到匹配结果'
    case 'no-options': return '暂无可用选项'
  }
})
</script>
