/**
 * Permission Modal 命令式 API
 *
 * 提供 openPermissionModal() 函数，以命令式方式创建并挂载 PermissionModal 组件。
 * 返回 { open(), close(), onSaved(cb) } 供宿主页面调用。
 *
 * 使用方式:
 *   const modal = openPermissionModal({ providerName: 'R', providerKey: 'admin' })
 *   modal.onSaved(() => { /* 刷新列表 * / })
 *   modal.open()
 */

import { createApp, type ComponentPublicInstance } from 'vue'
import ElementPlus from 'element-plus'
import PermissionModalVue from '../components/PermissionModal.vue'
import 'element-plus/dist/index.css'

interface PermissionModalParams {
  providerName: string
  providerKey: string
}

interface PermissionModalInstance {
  open(): void
  close(): void
  onSaved(callback: () => void): void
}

interface PermissionModalExposed {
  open: () => void
  close: () => void
  onSaved: (cb: () => void) => void
}

/**
 * 打开权限管理弹窗
 *
 * 创建 PermissionModal 组件实例并挂载到 document.body，
 * 返回命令式控制接口。
 */
export function openPermissionModal(params: PermissionModalParams): PermissionModalInstance {
  const container = document.createElement('div')
  container.setAttribute('data-permission-modal', '')
  document.body.appendChild(container)

  const savedCallbacks: Array<() => void> = []

  const app = createApp(PermissionModalVue, {
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

  const vm = app.mount(container) as ComponentPublicInstance & PermissionModalExposed

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
