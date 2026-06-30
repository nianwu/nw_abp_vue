<template>
  <div />
</template>

<script setup lang="ts">
/**
 * 全局加载进度条 — nprogress 封装
 * 通过 httpClient 拦截器自动联动，无需手动调用
 */
import nprogress from 'nprogress'

let pending = 0

export function startLoader() {
  if (pending === 0) nprogress.start()
  pending++
}

export function stopLoader() {
  pending = Math.max(0, pending - 1)
  if (pending === 0) nprogress.done()
}
</script>
