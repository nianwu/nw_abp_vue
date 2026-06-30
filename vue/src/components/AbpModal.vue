<template>
  <el-dialog
    :model-value="visible"
    :title="title"
    :width="dialogWidth"
    :fullscreen="isFullscreen"
    :close-on-click-modal="false"
    :close-on-press-escape="!dirty"
    :before-close="handleBeforeClose"
    @update:model-value="$emit('update:visible', $event)"
    destroy-on-close
  >
    <slot />
    <template #footer>
      <el-button @click="handleCancel" :disabled="loading">{{ cancelLabel }}</el-button>
      <el-button type="primary" @click="handleConfirm" :loading="loading" :disabled="loading">
        {{ confirmLabel }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'

const props = withDefaults(defineProps<{
  visible: boolean
  title: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen'
  loading?: boolean
  dirty?: boolean
  confirmLabel?: string
  cancelLabel?: string
}>(), {
  size: 'md',
  loading: false,
  dirty: false,
  confirmLabel: '保存',
  cancelLabel: '取消',
})

const emit = defineEmits<{
  'update:visible': [v: boolean]
  confirm: []
  cancel: []
}>()

const sizeMap: Record<string, string> = { sm: '420px', md: '600px', lg: '800px', xl: '1000px', fullscreen: '100%' }
const dialogWidth = computed(() => sizeMap[props.size])

const isFullscreen = ref(false)
function handleResize() { isFullscreen.value = window.innerWidth < 768 }
onMounted(() => { handleResize(); window.addEventListener('resize', handleResize) })
onUnmounted(() => window.removeEventListener('resize', handleResize))

async function handleBeforeClose(done: () => void) {
  if (props.dirty) {
    try {
      const { showConfirm } = await import('./AbpConfirmDialog')
      const ok = await showConfirm({ title: '提示', message: '有未保存的更改，确定关闭吗？' })
      if (ok) done()
    } catch { done() }
  } else {
    done()
  }
}

function handleConfirm() { emit('confirm') }
function handleCancel() { emit('update:visible', false); emit('cancel') }
</script>
