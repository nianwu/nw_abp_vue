/**
 * 日期渲染工具 — 提供三种显示模式，供表格列和构建时间等场景复用
 *
 *   full      → 2026/7/1 14:30:00
 *   relative  → 3 小时前（超过 3 天回退完整日期）
 *   combined  → 2026/7/1 14:30:00 (3 小时前)
 */
import { format, formatDistanceStrict, differenceInDays } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export type DateRenderMode = 'full' | 'relative' | 'combined'

/** 日期渲染模式选项（供 UI 列设置等使用） */
export const DATE_RENDER_MODES: { value: DateRenderMode; label: string; example: string }[] = [
  { value: 'full', label: '完整日期', example: '2026/7/1 14:30:00' },
  { value: 'relative', label: '相对时间', example: '3 小时前 / >3天显示完整日期' },
  { value: 'combined', label: '完整+相对', example: '2026/7/1 14:30:00 (3 小时前)' },
]

const FULL_FORMAT = 'yyyy/M/d HH:mm:ss'

/**
 * 格式化日期单元格
 * @param cell 日期原始值（字符串/数字/Date）
 * @param mode  渲染模式，默认 'combined'
 */
export function formatDateCell(cell: unknown, mode: DateRenderMode = 'combined'): string {
  if (!cell) return '-'
  let date: Date
  try {
    date = new Date(cell as string)
    if (isNaN(date.getTime())) return String(cell)
  } catch {
    return String(cell)
  }

  const full = format(date, FULL_FORMAT)
  if (mode === 'full') return full

  // 超过 3 天回退完整日期
  if (differenceInDays(Date.now(), date) > 3) return full

  const relative = formatDistanceStrict(date, Date.now(), { locale: zhCN, addSuffix: true })
  if (mode === 'relative') return relative

  // combined
  return `${full} (${relative})`
}
