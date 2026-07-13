<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-gray-700">{{ appName }}</h1>
      </div>
      <el-card shadow="always">
        <router-view />
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { APP_NAME } from '@/config'
const appName = APP_NAME
</script>
