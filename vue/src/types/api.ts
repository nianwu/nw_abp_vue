/**
 * 通用 API 类型定义
 *
 * ⚠️ 过渡类型，后端可用时执行 `abp generate-proxy` 覆盖。
 */

/** ABP 分页请求参数 */
export interface PagedRequestDto {
  skipCount?: number
  maxResultCount?: number
  sorting?: string
  filter?: string
}

/** ABP 分页响应 */
export interface PagedResultDto<T> {
  items: T[]
  totalCount: number
}

/** ABP 列表响应（不分页） */
export interface ListResultDto<T> {
  items: T[]
}

/** 通用查询结果 */
export interface LookupDto<T = string> {
  id: T
  displayName: string
}
