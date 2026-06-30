<template>
  <div class="flex flex-col items-center justify-center h-full">
    <div class="text-6xl font-bold text-gray-300 mb-4">{{ code }}</div>
    <h2 class="text-xl text-gray-600 mb-2">{{ title }}</h2>
    <p class="text-gray-400 mb-6">{{ description }}</p>
    <el-button v-if="code === 404" type="primary" @click="$router.push('/')">返回首页</el-button>
    <el-button v-if="code === 403" type="primary" @click="$router.back()">返回上一页</el-button>
    <el-button v-if="code === 500" type="primary" @click="$router.push('/')">返回首页</el-button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ code: 403 | 404 | 500 }>()

const info = {
  403: { title: '无权限访问', description: '您没有访问此页面的权限' },
  404: { title: '页面未找到', description: '您访问的页面不存在' },
  500: { title: '服务器错误', description: '服务器发生异常，请稍后重试' },
}

const title = computed(() => info[props.code].title)
const description = computed(() => info[props.code].description)
</script>
