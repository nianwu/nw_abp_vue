/**
 * Toast 消息封装 — ElMessage 包装
 */
import { ElMessage } from 'element-plus'

const DURATION = 3000

export function showSuccess(msg: string) { ElMessage.success({ message: msg, duration: DURATION }) }
export function showError(msg: string) { ElMessage.error({ message: msg, duration: DURATION }) }
export function showWarning(msg: string) { ElMessage.warning({ message: msg, duration: DURATION }) }
export function showInfo(msg: string) { ElMessage.info({ message: msg, duration: DURATION }) }
