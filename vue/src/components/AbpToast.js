/**
 * Toast 消息封装 — ElMessage 包装
 */
import { ElMessage } from 'element-plus';
const DURATION = 3000;
export function showSuccess(msg) { ElMessage.success({ message: msg, duration: DURATION }); }
export function showError(msg) { ElMessage.error({ message: msg, duration: DURATION }); }
export function showWarning(msg) { ElMessage.warning({ message: msg, duration: DURATION }); }
export function showInfo(msg) { ElMessage.info({ message: msg, duration: DURATION }); }
