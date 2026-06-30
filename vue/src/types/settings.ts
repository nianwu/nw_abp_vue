/**
 * ABP Setting Management 模块类型定义
 *
 * ⚠️ @generated — 临时从 swagger.json 提取。
 * 后端可用时执行 `abp generate-proxy` 重新生成覆盖此目录全部文件。
 */

// ============================================================
// Email 设置
// ============================================================

export interface EmailSettingsDto {
  smtpHost: string | null
  smtpPort: number
  smtpUserName: string | null
  smtpPassword: string | null
  smtpDomain: string | null
  smtpEnableSsl: boolean
  smtpUseDefaultCredentials: boolean
  defaultFromAddress: string | null
  defaultFromDisplayName: string | null
}

export interface UpdateEmailSettingsDto {
  smtpHost: string | null
  smtpPort: number
  smtpUserName: string | null
  smtpPassword: string | null
  smtpDomain: string | null
  smtpEnableSsl: boolean
  smtpUseDefaultCredentials: boolean
  defaultFromAddress: string
  defaultFromDisplayName: string
}

export interface SendTestEmailInput {
  subject: string
  body: string | null
  senderEmailAddress: string
  targetEmailAddress: string
}
