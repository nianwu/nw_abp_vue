/**
 * Feature 切片 — 功能开关管理
 *
 * 提供功能/特性开关的读取与设置，以及 FeatureModal 管理弹窗。
 *
 * 对外接口：
 *   import { openFeatureModal, standaloneGetFeatures, ... } from '@/slices/feature'
 */

// API — 从生成层 re-export（abp generate-proxy 输出到 @/api/）
export * from '@/api/feature'

// Types — 从生成层 re-export（abp generate-proxy 输出到 @/types/）
export type {
  GetFeatureListResultDto,
  FeatureGroupDto,
  FeatureDto,
  IStringValueType,
} from '@/types/feature'

// Store — Standalone 模式数据存储
export {
  standaloneGetFeatures,
  standaloneSetFeatures,
  standaloneUpdateFeatureValue,
} from './stores/feature-store'

// Utils — 命令式弹窗 API
export { openFeatureModal } from './utils/feature-modal'

// Components — 功能管理弹窗
export { default as FeatureModal } from './components/FeatureModal.vue'
