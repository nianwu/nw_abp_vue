/**
 * localStorage 持久化工具 — 为 standalone stores 提供存储抽象
 *
 * 所有 key 以 `abp:standalone:` 为前缀，与 Pinia persistedstate 等隔离。
 *
 * API:
 *   load<T>(key)        读取并反序列化
 *   save<T>(key, data)  序列化写入
 *   seed<T>(key, data)  仅当 key 不存在时写入（首次播种）
 *   remove(key)         删除单个 key
 *   resetAll()          清除所有 abp:standalone: 前缀的 key
 */

const PREFIX = 'abp:standalone:'

function prefixed(key: string): string {
  return PREFIX + key
}

export function load<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(prefixed(key))
    if (raw === null) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export function save<T>(key: string, data: T): void {
  try {
    localStorage.setItem(prefixed(key), JSON.stringify(data))
  } catch {
    // localStorage 满或不可用，静默失败
  }
}

/** 仅当 key 不存在时写入，用于首次播种 */
export function seed<T>(key: string, data: T): boolean {
  if (load(key) !== null) return false
  save(key, data)
  return true
}

export function remove(key: string): void {
  try {
    localStorage.removeItem(prefixed(key))
  } catch {
    // ignore
  }
}

/** 清除所有 abp:local: 前缀的 key */
export function resetAll(): void {
  const keysToRemove: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith(PREFIX)) {
      keysToRemove.push(key)
    }
  }
  keysToRemove.forEach(k => localStorage.removeItem(k))
}
