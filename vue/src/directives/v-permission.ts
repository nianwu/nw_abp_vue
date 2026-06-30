/**
 * v-permission 指令 — DOM 级权限控制
 *
 * 用法: <el-button v-permission="'AbpIdentity.Users.Create'">新建</el-button>
 */
import type { Directive, DirectiveBinding } from 'vue'
import { usePermission } from '@/composables/usePermission'

export const vPermission: Directive<HTMLElement, string> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string>) {
    if (!binding.value) return
    const { hasPermission } = usePermission()
    if (!hasPermission(binding.value)) {
      el.parentNode?.removeChild(el)
    }
  },
}
