/**
 * ABP Feature Management 模块类型定义
 *
 * ⚠️ @generated — 临时手写，后端可用时执行 `abp generate-proxy` 覆盖。
 */

// ============================================================
// Feature List
// ============================================================

export interface GetFeatureListResultDto {
  groups?: FeatureGroupDto[] | null
}

export interface FeatureGroupDto {
  name?: string | null
  displayName?: string | null
  features?: FeatureDto[] | null
}

export interface FeatureDto {
  name?: string | null
  displayName?: string | null
  parentName?: string | null
  description?: string | null
  value?: string | null
  depth: number
  valueType: IStringValueType
  provider?: FeatureProviderDto | null
}

export interface FeatureProviderDto {
  name?: string | null
  key?: string | null
}

// ============================================================
// Value Type
// ============================================================

export interface IStringValueType {
  readonly name: string
  readonly properties: Record<string, unknown>
  validator: IValueValidator
}

export interface IValueValidator {
  readonly name: string
  readonly properties: Record<string, unknown>
}

// ============================================================
// Update
// ============================================================

export interface UpdateFeatureDto {
  name?: string | null
  value?: string | null
}

export interface UpdateFeaturesDto {
  features?: UpdateFeatureDto[] | null
}
