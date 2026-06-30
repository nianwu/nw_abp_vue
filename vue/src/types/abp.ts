/**
 * ABP 框架基础类型定义
 *
 * ⚠️ @generated — 临时从 swagger.json 提取。
 * 后端可用时执行 `abp generate-proxy` 重新生成覆盖此目录全部文件。
 */

// ============================================================
// 错误响应
// ============================================================

export interface RemoteServiceErrorResponse {
  error?: RemoteServiceErrorInfo
}

export interface RemoteServiceErrorInfo {
  code?: string
  message?: string
  details?: string
  data?: Record<string, unknown>
  validationErrors?: RemoteServiceValidationErrorInfo[]
}

export interface RemoteServiceValidationErrorInfo {
  message?: string
  members?: string[]
}

// ============================================================
// ApplicationConfiguration
// ============================================================

export interface ApplicationConfigurationDto {
  auth: ApplicationAuthConfigurationDto
  currentTenant: CurrentTenantDto
  currentUser: CurrentUserDto
  clock: ClockDto
  extraProperties?: Record<string, unknown>
  features: ApplicationFeatureConfigurationDto
  globalFeatures: ApplicationGlobalFeatureConfigurationDto
  localization: ApplicationLocalizationConfigurationDto
  multiTenancy: MultiTenancyInfoDto
  objectExtensions: ObjectExtensionsDto
  setting: ApplicationSettingConfigurationDto
  timing: TimingDto
}

export interface ApplicationAuthConfigurationDto {
  grantedPolicies: Record<string, boolean>
}

export interface ApplicationFeatureConfigurationDto {
  values: Record<string, string>
}

export interface ApplicationGlobalFeatureConfigurationDto {
  enabledFeatures: string[]
}

export interface ApplicationSettingConfigurationDto {
  values: Record<string, string>
}

// ============================================================
// CurrentUser / CurrentTenant
// ============================================================

export interface CurrentUserDto {
  id?: string
  isAuthenticated: boolean
  impersonatorUserId?: string
  impersonatorTenantId?: string
  impersonatorTenantName?: string
  impersonatorUserName?: string
  userName?: string
  name?: string
  surName?: string
  email?: string
  emailVerified: boolean
  phoneNumber?: string
  phoneNumberVerified: boolean
  tenantId?: string
  sessionId?: string
  roles: string[]
}

export interface CurrentTenantDto {
  id?: string
  name?: string
  isAvailable: boolean
}

export interface MultiTenancyInfoDto {
  isEnabled: boolean
  userSharingStrategy: TenantUserSharingStrategy
}

export enum TenantUserSharingStrategy {
  PerUser = 0,
  PerTenant = 1,
}

// ============================================================
// Localization
// ============================================================

export interface ApplicationLocalizationConfigurationDto {
  currentCulture: CurrentCultureDto
  defaultResourceName?: string
  languages: LanguageInfo[]
  languagesMap: Record<string, unknown>
  languageFilesMap: Record<string, unknown>
  resources: Record<string, unknown>
  useRouteBasedCulture: boolean
  values: Record<string, Record<string, string>>
}

export interface CurrentCultureDto {
  name?: string
  cultureName?: string
  displayName?: string
  englishName?: string
  nativeName?: string
  twoLetterIsoLanguageName?: string
  threeLetterIsoLanguageName?: string
  dateTimeFormat: DateTimeFormatDto
  isRightToLeft: boolean
}

export interface DateTimeFormatDto {
  calendarAlgorithmType?: string
  dateSeparator?: string
  dateTimeFormatLong?: string
  fullDateTimePattern?: string
  longTimePattern?: string
  shortDatePattern?: string
  shortTimePattern?: string
}

export interface LanguageInfo {
  cultureName?: string
  uiCultureName?: string
  displayName?: string
  twoLetterISOLanguageName?: string
}

/** ABP /api/abp/application-localization 响应 */
export interface ApplicationLocalizationDto {
  currentCulture: CurrentCultureDto
  resources: Record<string, { texts: Record<string, string> }>
}

// ============================================================
// Timing / Clock
// ============================================================

export interface TimingDto {
  timeZone: TimeZone
}

export interface TimeZone {
  windows: WindowsTimeZone
  iana: IanaTimeZone
}

export interface WindowsTimeZone {
  timeZoneId?: string
}

export interface IanaTimeZone {
  timeZoneName?: string
}

export interface ClockDto {
  kind?: string
}

// ============================================================
// Dynamic Form
// ============================================================

export interface AbpFormItem {
  name: string
  type: 'text' | 'number' | 'email' | 'password' | 'switch' | 'select' | 'date' | 'textarea'
  label: string
  required?: boolean
  placeholder?: string
  options?: { label: string; value: string | number | boolean }[]
  readonly?: boolean
  defaultValue?: unknown
}

// ============================================================
// 审计字段 mixin
// ============================================================

export interface HasCreationTime {
  creationTime?: string
}

export interface HasModificationTime {
  lastModificationTime?: string
}

export interface AuditedEntity extends HasCreationTime, HasModificationTime {}

// ============================================================
// Object Extensions (简化)
// ============================================================

export interface ObjectExtensionsDto {
  modules: Record<string, unknown>
  enums: Record<string, unknown>
}
