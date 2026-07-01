/**
 * Provider 接口 — 为启动时阻塞依赖定义抽象合约
 *
 * 每个接口有两套实现：
 *   - remote/     使用真实 API/OIDC（生产/联调）
 *   - standalone/ 解耦接口依赖，localStorage + 种子数据（快速开发）
 */
import type { ApplicationConfigurationDto } from '@/types/abp'

// ============================================================
// I18nProvider — 本地化资源加载
// ============================================================
export interface I18nProvider {
  /** 加载指定语言的翻译资源并注入 vue-i18n */
  loadMessages(lang: string): Promise<void>
  /** 切换语言 */
  switchLanguage(lang: string): Promise<void>
}

// ============================================================
// ConfigProvider — 应用配置获取
// ============================================================
export interface ConfigProvider {
  /** 获取 ABP ApplicationConfiguration */
  fetchConfig(): Promise<ApplicationConfigurationDto>
}

// ============================================================
// AuthProvider — 认证
// ============================================================
export interface AuthProvider {
  /** 静默恢复登录态（已有 session 时） */
  trySilentLogin(): Promise<boolean>
  /** 发起完整登录 */
  login(): Promise<void>
  /** 登出 */
  logout(): Promise<void>
  /** 获取当前 access token */
  getToken(): Promise<string | null>
}

// ============================================================
// Provider 集合
// ============================================================
export interface AppProviders {
  i18n: I18nProvider
  config: ConfigProvider
  auth: AuthProvider
  /** 初始化基础设施（standalone 模式注册 HTTP 拦截器，remote 模式为 no-op） */
  setupInfrastructure(): void | Promise<void>
}
