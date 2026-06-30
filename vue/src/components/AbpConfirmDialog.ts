/**
 * 确认对话框封装 — ElMessageBox.confirm 包装
 */
import { ElMessageBox } from 'element-plus'

export function showConfirm(options: {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'warning' | 'info' | 'error'
}): Promise<boolean> {
  return ElMessageBox.confirm(options.message, options.title, {
    confirmButtonText: options.confirmText || '确认',
    cancelButtonText: options.cancelText || '取消',
    type: options.type || 'warning',
  })
    .then(() => true)
    .catch(() => false)
}
