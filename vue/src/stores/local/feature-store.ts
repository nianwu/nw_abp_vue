/**
 * 功能管理 localStorage store — 功能开关（只读，由种子注入）
 *
 * 数据存储于 localStorage，键：abp:local:features
 */

import { load, save } from './storage'
import type { GetFeatureListResultDto } from '@/types/feature'

const KEY = 'features'

export function localGetFeatures(): GetFeatureListResultDto | null {
  return load<GetFeatureListResultDto>(KEY)
}

export function localSetFeatures(data: GetFeatureListResultDto): void {
  save(KEY, data)
}

export function localUpdateFeatureValue(featureName: string, value: string): void {
  const data = load<GetFeatureListResultDto>(KEY)
  if (!data) return
  for (const group of data.groups) {
    for (const feature of group.features) {
      if (feature.name === featureName) {
        feature.value = value
      }
    }
  }
  save(KEY, data)
}
