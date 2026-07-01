/**
 * 设置管理 localStorage store — 邮件设置 + 时区设置
 *
 * 数据存储于 localStorage，键：abp:local:emailSettings / abp:local:timezone / abp:local:timezones
 */

import { load, save } from './storage'
import type { EmailSettingsDto } from '@/types/settings'

const EMAIL_KEY = 'emailSettings'
const TIMEZONE_KEY = 'timezone'
const TIMEZONES_KEY = 'timezones'

// ============================================================
// 邮件设置
// ============================================================

export function standaloneGetEmailSettings(): EmailSettingsDto | null {
  return load<EmailSettingsDto>(EMAIL_KEY)
}

export function standaloneSetEmailSettings(data: EmailSettingsDto): void {
  save(EMAIL_KEY, data)
}

export function standaloneUpdateEmailSettings(data: EmailSettingsDto): void {
  save(EMAIL_KEY, data)
}

// ============================================================
// 时区
// ============================================================

export function standaloneGetTimezone(): string {
  return load<string>(TIMEZONE_KEY) || 'Asia/Shanghai'
}

export function standaloneSetTimezone(tz: string): void {
  save(TIMEZONE_KEY, tz)
}

export function standaloneGetTimezones(): string[] {
  return load<string[]>(TIMEZONES_KEY) || []
}

export function standaloneSetTimezones(data: string[]): void {
  save(TIMEZONES_KEY, data)
}
