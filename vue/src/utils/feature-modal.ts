/**
 * Feature Modal 命令式 API
 *
 * 提供 openFeatureModal() 函数，以命令式方式创建并挂载 FeatureModal 组件。
 * 返回 { open(), close(), onSaved(cb) } 供宿主页面调用。
 *
 * 使用方式:
 *   const modal = openFeatureModal({ providerName: 'T', providerKey: tenantId })
 *   modal.onSaved(() => { /* 刷新列表 * / })
 *   modal.open()
 */

import { createApp, type ComponentPublicInstance } from 'vue'
import ElementPlus from 'element-plus'
import FeatureModalVue from '../components/FeatureModal.vue'
import 'element-plus/dist/index.css'

interface FeatureModalParams {
  providerName: string
  providerKey: string
}

interface FeatureModalInstance {
  open(): void
  close(): void
  onSaved(callback: () => void): void
}

interface FeatureModalExposed {
  open: () => void
  close: () => void
  onSaved: (cb: () => void) => void
}

/**
 * 打开功能管理弹窗
 *
 * 创建 FeatureModal 组件实例并挂载到 document.body，
 * 返回命令式控制接口。封装全部内部状态，宿主页面不持有
 * visible/loading/dirty 等状态。
 */
export function openFeatureModal(params: FeatureModalParams): FeatureModalInstance {
  const container = document.createElement('div')
  container.setAttribute('data-feature-modal', '')
  document.body.appendChild(container)

  const savedCallbacks: Array<() => void> = []

  const app = createApp(FeatureModalVue, {
    providerName: params.providerName,
    providerKey: params.providerKey,
    onSaveSuccess: () => {
      for (const cb of savedCallbacks) {
        try { cb() } catch { /* swallow */ }
      }
    },
    onClose: () => {
      cleanup()
    },
  })

  app.use(ElementPlus)

  const vm = app.mount(container) as ComponentPublicInstance & FeatureModalExposed

  function cleanup() {
    savedCallbacks.length = 0
    app.unmount()
    if (container.parentNode) {
      container.parentNode.removeChild(container)
    }
  }

  return {
    open() {
      vm.open()
    },
    close() {
      vm.close()
    },
    onSaved(callback: () => void) {
      savedCallbacks.push(callback)
    },
  }
}
