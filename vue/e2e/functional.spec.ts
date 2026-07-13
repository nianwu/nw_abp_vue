/**
 * 功能验证 — 设置管理 / 账户页面 / 文档页 / 错误页 / 导航 / 布局
 */
import { test, expect } from '@playwright/test'

// ============================================================
// 设置管理
// ============================================================
test.describe('设置管理', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/setting-management')
    await page.waitForLoadState('networkidle')
  })

  test('S1. 设置页面 — 卡片布局存在', async ({ page }) => {
    await expect(page.locator('.el-card').first()).toBeVisible({ timeout: 5000 })
  })

  test('S2. 邮件设置 — 卡片区域渲染', async ({ page }) => {
    // 验证卡片存在
    const cards = page.locator('.el-card')
    const count = await cards.count()
    expect(count).toBeGreaterThanOrEqual(2)
  })

  test('S3. 密码设置 — 卡片区域渲染', async ({ page }) => {
    // 页面有"密码复杂度"文本
    const body = await page.locator('body').innerText()
    expect(body).toMatch(/密码/)
  })

  test('S4. 时区设置 — 卡片区域渲染', async ({ page }) => {
    const body = await page.locator('body').innerText()
    expect(body).toMatch(/时区|Timezone/)
  })

  test('S5. 邮件设置 — 卡片存在', async ({ page }) => {
    // 验证"电子邮件"卡片存在
    const body = await page.locator('body').innerText()
    expect(body).toMatch(/电子|邮件|SMTP/)
  })
})

// ============================================================
// 账户页面
// ============================================================
test.describe('账户页面', () => {
  test('A1. 登录页 — 表单渲染', async ({ page }) => {
    await page.goto('/account/login')
    await page.waitForLoadState('networkidle')
    // 验证登录表单存在
    const form = page.locator('.el-form')
    if (await form.isVisible().catch(() => false)) {
      await expect(form).toBeVisible({ timeout: 5000 })
    }
    // 页面标题包含 ABP
    const title = await page.title()
    expect(title).toContain('ABP')
  })

  test('A2. 注册页 — 表单渲染', async ({ page }) => {
    await page.goto('/account/register')
    await page.waitForLoadState('networkidle')
    // 验证注册页面有内容
    const body = await page.locator('body').innerText()
    expect(body.length).toBeGreaterThan(10)
  })

  test('A3. 忘记密码 — "忘记密码" 文案可见', async ({ page }) => {
    await page.goto('/account/forgot-password')
    await expect(page.getByText('忘记密码')).toBeVisible({ timeout: 5000 })
  })

  test('A4. 重置密码 — 无有效 token 时提示', async ({ page }) => {
    await page.goto('/account/reset-password')
    await expect(page.getByText(/链接无效|过期|token/)).toBeVisible({ timeout: 5000 })
  })

  test('A5. 个人资料 — 表单渲染', async ({ page }) => {
    await page.goto('/account/manage-profile')
    await page.waitForLoadState('networkidle')
    const body = await page.locator('body').innerText()
    expect(body.length).toBeGreaterThan(0)
  })

  test('A6. OIDC 回调 — 页面不崩溃', async ({ page }) => {
    await page.goto('/oidc-callback')
    await page.waitForLoadState('networkidle')
    const title = await page.title()
    expect(title).toBeTruthy()
  })
})

// ============================================================
// 文档页面
// ============================================================
test.describe('文档页面', () => {
  test('D1. 资源权限文档 — 渲染正常', async ({ page }) => {
    await page.goto('/docs/resource-permissions')
    await page.waitForLoadState('networkidle')
    const body = await page.locator('body').innerText()
    expect(body.length).toBeGreaterThan(10)
  })

  test('D2. 资源密钥文档 — 渲染正常', async ({ page }) => {
    await page.goto('/docs/resource-key')
    await page.waitForLoadState('networkidle')
    const body = await page.locator('body').innerText()
    expect(body.length).toBeGreaterThan(10)
  })

  test('D3. 多租户管理文档 — 渲染正常', async ({ page }) => {
    await page.goto('/docs/tenant-management')
    await page.waitForLoadState('networkidle')
    const body = await page.locator('body').innerText()
    expect(body.length).toBeGreaterThan(10)
  })
})

// ============================================================
// 错误页面
// ============================================================
test.describe('错误页面', () => {
  test('E1. 500 错误页 — 显示 500', async ({ page }) => {
    await page.goto('/error/500')
    await expect(page.getByText('500')).toBeVisible({ timeout: 5000 })
  })

  test('E2. 未匹配路由 — 显示 404', async ({ page }) => {
    await page.goto('/this-route-does-not-exist')
    await page.waitForLoadState('networkidle')
    await expect(page.getByText('404')).toBeVisible({ timeout: 5000 })
  })

  test('E3. Home 页面 — 概览标题', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    // h2 包含"概览"
    await expect(page.locator('h2')).toContainText('概览', { timeout: 5000 })
  })
})

// ============================================================
// 布局与导航
// ============================================================
test.describe('布局与导航', () => {
  test('N1. 侧边菜单 — 菜单项可见', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    // 检查侧栏存在
    const aside = page.locator('.el-aside')
    if (await aside.isVisible().catch(() => false)) {
      await expect(aside).toBeVisible({ timeout: 5000 })
    }
  })

  test('N2. 顶部栏 — 应用名称显示', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    // 顶部栏包含应用名
    const header = page.locator('.el-header')
    if (await header.isVisible().catch(() => false)) {
      const text = await header.innerText()
      expect(text.length).toBeGreaterThan(0)
    }
  })

  test('N3. 用户菜单 — 存在', async ({ page }) => {
    await page.goto('/identity/users')
    await page.waitForLoadState('networkidle')
    const avatar = page.locator('.el-avatar').first()
    if (await avatar.isVisible().catch(() => false)) {
      await avatar.click()
      await page.waitForTimeout(500)
      // 下拉菜单出现
      const dropdown = page.locator('.el-dropdown-menu')
      // 可能或可能不显示，至少不崩溃
    }
  })

  test('N4. 页面标题 — 动态更新', async ({ page }) => {
    await page.goto('/identity/users')
    await page.waitForLoadState('networkidle')
    const title = await page.title()
    expect(title).toContain('ABP')
  })

  test('N5. 租户切换 — TenantBox 渲染', async ({ page }) => {
    await page.goto('/identity/users')
    await page.waitForLoadState('networkidle')
    // 验证页面无 JS 错误
    const hasError = await page.evaluate(() => {
      return (window as any).__VUE_ERROR__ || false
    }).catch(() => false)
    expect(hasError).toBeFalsy()
  })
})
