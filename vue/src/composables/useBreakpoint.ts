/**
 * 响应式断点 composable — 提供 isMobile/isTablet/isDesktop 判断
 *
 * 用于组件中根据窗口宽度切换布局、全屏模式等。
 * 使用 resize 事件监听，在组件卸载时自动清理。
 */
import { ref, onMounted, onUnmounted } from 'vue'

export function useBreakpoint() {
  const width = ref(window.innerWidth)
  const isMobile = ref(width.value < 768)
  const isTablet = ref(width.value >= 768 && width.value < 1024)
  const isDesktop = ref(width.value >= 1024)

  function onResize() {
    width.value = window.innerWidth
    isMobile.value = width.value < 768
    isTablet.value = width.value >= 768 && width.value < 1024
    isDesktop.value = width.value >= 1024
  }

  onMounted(() => window.addEventListener('resize', onResize))
  onUnmounted(() => window.removeEventListener('resize', onResize))

  return { width, isMobile, isTablet, isDesktop }
}
