/**
 * Account 切片 — 账户管理（登录/注册/密码/个人资料）
 *
 * 包含认证相关的全部页面组件，复用 AccountLayout。
 */

// Re-export API
export * from '@/api/account'

// Re-export Types
export type {
  UserLoginInfo, AbpLoginResult, ProfileDto, RegisterDto,
  SendPasswordResetCodeDto, ResetPasswordDto, UpdateProfileDto,
  ChangePasswordInput, VerifyPasswordResetTokenInput,
} from '@/types/account'

// Views
export { default as LoginView } from './views/LoginView.vue'
export { default as RegisterView } from './views/RegisterView.vue'
export { default as ForgotPasswordView } from './views/ForgotPasswordView.vue'
export { default as ResetPasswordView } from './views/ResetPasswordView.vue'
export { default as ManageProfileView } from './views/ManageProfileView.vue'
export { default as OidcCallbackView } from './views/OidcCallbackView.vue'
