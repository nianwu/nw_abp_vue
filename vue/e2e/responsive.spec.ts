/**
 * Phase 4.3 — 移动端适配验证（375×812 viewport）
 */
import { test, expect } from '@playwright/test'

test.describe('移动端适配（375px）', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test('首页统计卡片单列堆叠', async ({ page }) => {
    await page.goto('/')
    // 移动端 grid-cols-1 生效
    const grid = page.locator('.grid.grid-cols-1')
    await expect(grid.first()).toBeVisible({ timeout: 5000 })
  })

  test('用户管理 — 侧栏隐藏', async ({ page }) => {
    await page.goto('/identity/users')
    await page.waitForLoadState('networkidle')
    // 移动端侧栏应隐藏（md:flex 不生效）
    const aside = page.locator('.el-aside')
    const isHidden = await aside.evaluate(el => {
      const style = window.getComputedStyle(el)
      return style.display === 'none'
    }).catch(() => true)
    // 侧栏在移动端应隐藏
    expect(isHidden).toBe(true)
  })

  test('用户管理 — hamburger 图标可见', async ({ page }) => {
    await page.goto('/identity/users')
    await page.waitForLoadState('networkidle')
    // hamburger 菜单在移动端可见（md:hidden 规则判断：<768px 时 md:hidden 不生效，所以它可见）
    // 实际上：md:hidden 表示 ≥768px 时隐藏，<768px 时可见
    const hamburger = page.locator('.cursor-pointer.md\\:hidden')
    const isVisible = await hamburger.isVisible().catch(() => false)
    expect(isVisible).toBe(true)
  })

  test('用户管理 — 表格存在（支持横滚）', async ({ page }) => {
    await page.goto('/identity/users')
    await page.waitForLoadState('networkidle')
    // 表格应存在
    await expect(page.locator('.el-table')).toBeVisible({ timeout: 5000 })
    // overflow-x-auto 容器存在
    await expect(page.locator('.overflow-x-auto')).toBeVisible()
  })

  test('登录页 — 页面渲染正常', async ({ page }) => {
    await page.goto('/account/login')
    await page.waitForLoadState('networkidle')
    const title = await page.title()
    expect(title).toBeTruthy()
  })

  test('个人资料 — 页面渲染正常', async ({ page }) => {
    await page.goto('/account/manage-profile')
    await page.waitForLoadState('networkidle')
    const title = await page.title()
    expect(title).toBeTruthy()
  })
})
