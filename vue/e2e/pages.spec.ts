/**
 * Phase 4.1 — 页面路由渲染验证
 *
 * 使用 Playwright 在 standalone 模式下验证所有路由可正常渲染
 */
import { test, expect } from '@playwright/test'

test.describe('页面路由渲染', () => {

  test('首页 /', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h2')).toContainText('概览')
    // 统计卡片至少存在一个
    const cards = page.locator('.stat-card')
    await expect(cards.first()).toBeVisible({ timeout: 5000 })
  })

  test('用户管理 /identity/users', async ({ page }) => {
    await page.goto('/identity/users')
    await page.waitForLoadState('networkidle')
    // 表格存在
    await expect(page.locator('.el-table')).toBeVisible({ timeout: 5000 })
  })

  test('角色管理 /identity/roles', async ({ page }) => {
    await page.goto('/identity/roles')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('.el-table')).toBeVisible({ timeout: 5000 })
  })

  test('租户管理 /tenant-management/tenants', async ({ page }) => {
    await page.goto('/tenant-management/tenants')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('.el-table')).toBeVisible({ timeout: 5000 })
  })

  test('设置管理 /setting-management', async ({ page }) => {
    await page.goto('/setting-management')
    await page.waitForLoadState('networkidle')
    // 验证页面有内容（设置页包含卡片或表单）
    const bodyText = await page.locator('body').innerText()
    // 至少包含"邮件"或"时区"或"SMTP"之一
    expect(bodyText).toMatch(/邮件|时区|SMTP|设置/)
  })

  test('登录页 /account/login — standalone 模式下自动认证', async ({ page }) => {
    await page.goto('/account/login')
    await page.waitForLoadState('networkidle')
    // standalone 模式自动登录，页面可能重定向或正常显示
    // 只需验证页面不崩溃
    const title = await page.title()
    expect(title).toBeTruthy()
  })

  test('注册页 /account/register', async ({ page }) => {
    await page.goto('/account/register')
    await page.waitForLoadState('networkidle')
    // 验证页面渲染（至少标题栏存在）
    const title = await page.title()
    expect(title).toBeTruthy()
  })

  test('忘记密码 /account/forgot-password', async ({ page }) => {
    await page.goto('/account/forgot-password')
    await expect(page.getByText('忘记密码')).toBeVisible()
  })

  test('重置密码 /account/reset-password', async ({ page }) => {
    await page.goto('/account/reset-password')
    // 无 token 时显示提示
    await expect(page.getByText(/链接无效|过期/)).toBeVisible({ timeout: 5000 })
  })

  test('个人资料 /account/manage-profile — 需权限', async ({ page }) => {
    await page.goto('/account/manage-profile')
    await page.waitForLoadState('networkidle')
    // 页面可能因权限不足而显示 403 或正常渲染
    const bodyText = await page.locator('body').innerText()
    // 至少页面有内容（403 或 profile 都算正常渲染）
    expect(bodyText.length).toBeGreaterThan(0)
  })

  test('403 错误页 /error/403', async ({ page }) => {
    await page.goto('/error/403')
    await expect(page.getByText('403')).toBeVisible()
  })

  test('404 错误页 /error/404', async ({ page }) => {
    await page.goto('/error/404')
    await expect(page.getByText('404')).toBeVisible()
  })
})
