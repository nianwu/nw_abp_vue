<template>
  <el-breadcrumb separator="/" class="py-2">
    <el-breadcrumb-item
      v-for="(item, i) in breadcrumbs"
      :key="item.path"
      :to="i < breadcrumbs.length - 1 ? item.path : undefined"
    >
      {{ item.meta?.title || item.name }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const breadcrumbs = computed(() =>
  route.matched
    .filter((r) => r.name)
    .map((r) => ({ path: r.path, name: r.name, meta: r.meta })),
)
</script>
