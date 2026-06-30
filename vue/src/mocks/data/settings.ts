/**
 * Mock 设置管理数据 — 邮件设置与时区设置
 */
import type { EmailSettingsDto } from '@/types/settings'

export const mockEmailSettings: EmailSettingsDto = {
  smtpHost: 'smtp.example.com',
  smtpPort: 587,
  smtpUserName: 'noreply@example.com',
  smtpPassword: null,
  smtpDomain: 'example.com',
  smtpEnableSsl: true,
  smtpUseDefaultCredentials: false,
  defaultFromAddress: 'noreply@example.com',
  defaultFromDisplayName: 'ABP TodoApp',
}

export const mockTimezone = 'Asia/Shanghai'

export const mockTimezones: string[] = [
  'Asia/Shanghai',
  'Asia/Tokyo',
  'Asia/Seoul',
  'Asia/Singapore',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'America/New_York',
  'America/Chicago',
  'America/Los_Angeles',
  'Australia/Sydney',
  'Pacific/Auckland',
  'UTC',
]
