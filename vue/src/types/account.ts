/**
 * ABP Account 模块类型定义
 *
 * ⚠️ @generated — 临时手写。
 * 后端可用时执行 `abp generate-proxy` 重新生成覆盖此目录全部文件。
 */

// ============================================================
// 登录
// ============================================================

export interface UserLoginInfo {
  userNameOrEmailAddress: string
  password: string
  rememberMe: boolean
}

export enum LoginResultType {
  Success = 1,
  InvalidUserNameOrPassword = 2,
  NotAllowed = 3,
  LockedOut = 4,
  RequiresTwoFactor = 5,
}

export interface AbpLoginResult {
  result: LoginResultType
  readonly description: string | null
}

// ============================================================
// 个人资料
// ============================================================

export interface ProfileDto {
  userName: string | null
  email: string | null
  name: string | null
  surname: string | null
  phoneNumber: string | null
  hasPassword: boolean
  isExternal: boolean
  concurrencyStamp: string | null
  extraProperties: Record<string, unknown>
}

export interface UpdateProfileDto {
  userName: string | null
  email: string | null
  name: string | null
  surname: string | null
  phoneNumber: string | null
  concurrencyStamp: string | null
  extraProperties: Record<string, unknown>
}

// ============================================================
// 密码管理
// ============================================================

export interface ChangePasswordInput {
  currentPassword: string | null
  newPassword: string
}

export interface ResetPasswordDto {
  userId: string
  resetToken: string
  password: string
}

export interface SendPasswordResetCodeDto {
  /** @format email */
  email: string
  appName: string
  returnUrl: string | null
  returnUrlHash: string | null
}

export interface VerifyPasswordResetTokenInput {
  userId: string
  resetToken: string
}

// ============================================================
// 注册
// ============================================================

export interface RegisterDto {
  userName: string
  /** @format email */
  emailAddress: string
  password: string
  appName: string
  extraProperties: Record<string, unknown>
}
