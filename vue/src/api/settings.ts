/**
 * ABP Setting Management API 代理
 *
 * ⚠️ @generated — 由 `abp generate-proxy` 自动生成，请勿手动修改。
 * 后端可用时执行 `abp generate-proxy` 重新生成覆盖此文件。
 */

import { httpClient } from '@/api/http'
import type {
  EmailSettingsDto,
  UpdateEmailSettingsDto,
  SendTestEmailInput,
} from '@/types/settings'

/** 获取电子邮件设置 */
export function getEmailSettings(): Promise<EmailSettingsDto> {
  return httpClient.get('/api/setting-management/emailing').then((r) => r.data)
}

/** 更新电子邮件设置 */
export function updateEmailSettings(data: UpdateEmailSettingsDto): Promise<void> {
  return httpClient.post('/api/setting-management/emailing', data)
}

/** 发送测试邮件 */
export function sendTestEmail(data: SendTestEmailInput): Promise<void> {
  return httpClient.post('/api/setting-management/emailing/send-test-email', data)
}

/** 获取当前时区 */
export function getTimezone(): Promise<string> {
  return httpClient.get('/api/setting-management/timezone').then((r) => r.data)
}

/** 更新当前时区 */
export function updateTimezone(timezone?: string): Promise<void> {
  return httpClient.post('/api/setting-management/timezone', undefined, {
    params: timezone !== undefined ? { timezone } : undefined,
  })
}

/** 获取所有可用时区列表 */
export function getTimezones(): Promise<string[]> {
  return httpClient.get('/api/setting-management/timezone/timezones').then((r) => r.data)
}
