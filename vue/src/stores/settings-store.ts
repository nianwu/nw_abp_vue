/**
 * 设置管理 localStorage store — 邮件设置 + 时区设置
 *
 * 数据存储于 localStorage，键：abp:local:emailSettings / abp:local:timezone / abp:local:timezones
 */

import { load, save } from '@/core'
import type { EmailSettingsDto, IdentityPasswordSettingsDto } from '@/types/settings'

const EMAIL_KEY = 'emailSettings'
const PASSWORD_KEY = 'passwordSettings'
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

// ============================================================
// 密码复杂度设置
// 对应 ABP Identity 模块 Abp.Identity.Password.* 设置项
// ============================================================

export function standaloneGetPasswordSettings(): IdentityPasswordSettingsDto | null {
  return load<IdentityPasswordSettingsDto>(PASSWORD_KEY)
}

export function standaloneUpdatePasswordSettings(data: IdentityPasswordSettingsDto): void {
  save(PASSWORD_KEY, data)
}
