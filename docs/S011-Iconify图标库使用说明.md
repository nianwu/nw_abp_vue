# Iconify 图标库使用说明

> 目的：统一项目图标使用规范，解决 Element Plus Icons 图标种类有限的问题。
>
> 参考文件：
> - `vue/package.json`
> - [Iconify 官方文档](https://iconify.design/)
> - [Icônes — 图标浏览器](https://icones.js.org/)

---

## 一、为什么使用 Iconify

| 对比维度 | Element Plus Icons | Iconify |
|----------|-------------------|---------|
| **图标数量** | ~200 个 | **20 万+**（200+ 图标集） |
| **风格覆盖** | Filled 为主，线性不全 | Filled / Outline / Duotone / Sharp 全覆盖 |
| **按需加载** | Tree-shaking | 延迟加载（仅首次使用时拉取 SVG） |
| **包体积** | 全部注册 ~1MB | 零体积（SVG 按需从 CDN 加载） |
| **适用场景** | 组件内置图标（开关、按钮等） | 页面装饰、菜单、导航图标 |

**使用原则**：Element Plus 组件内置图标保持不变，**菜单、导航、页面标题**等自定义图标统一使用 Iconify。

---

## 二、安装

```bash
npm install @iconify/vue
```

已在 `vue/` 项目中安装（`@iconify/vue` → `vue/node_modules/@iconify/vue`）。

---

## 三、使用方式

### 3.1 基础用法

```vue
<template>
  <Icon icon="mdi:home-outline" />
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
</script>
```

### 3.2 常用属性

| 属性 | 说明 | 示例 |
|------|------|------|
| `icon` | 图标标识（`图标集:图标名`） | `"mdi:account"` |
| `width` / `height` | 尺寸（默认 `1em`，继承字体大小） | `"24"` / `"24"` |
| `color` | 颜色（支持 CSS 颜色值） | `"#409eff"` |
| `inline` | 内联模式（与文字对齐） | `true` |
| `flip` | 翻转 | `"horizontal"` / `"vertical"` |
| `rotate` | 旋转（1=90°, 2=180°, 3=270°） | `1` |

### 3.3 推荐图标集

| 图标集 | 前缀 | 风格 | 适合场景 |
|--------|------|------|----------|
| **Material Design Icons** | `mdi:` | 线性 / 24px 网格 | 通用界面、菜单导航 |
| **HeroIcons** | `heroicons:` | 线性 / 20px 网格 | 简洁现代 UI |
| **Lucide** | `lucide:` | 线性 / 24px 网格 | 轻量、一致性好 |
| **Carbon** | `carbon:` | 线性 / 16px 网格 | 企业级界面 |

**项目默认使用 `mdi:` 图标集**（图标最全、风格统一）。

### 3.4 与 Element Plus 图标混用

```vue
<!-- Element Plus 图标 — 组件内置场景（el-button icon 属性） -->
<el-button :icon="Edit">编辑</el-button>

<!-- Iconify 图标 — 菜单、标题、独立图标场景 -->
<Icon icon="mdi:account-edit-outline" width="18" />
```

### 3.5 查找图标

1. 打开 [Icônes](https://icones.js.org/)
2. 选择图标集（推荐 Material Design Icons）
3. 搜索关键词，点击选中图标
4. 复制标识（如 `mdi:account-outline`）
5. 在代码中粘贴使用

---

## 四、菜单图标对照表

| 菜单 | 旧图标 (EP) | 新图标 (Iconify) | 标识 |
|------|------------|------------------|------|
| 首页 | `HomeFilled` | <Icon icon="mdi:home-outline" /> | `mdi:home-outline` |
| 用户管理 | `User` | <Icon icon="mdi:account-outline" /> | `mdi:account-outline` |
| 角色管理 | `Avatar` | <Icon icon="mdi:account-group-outline" /> | `mdi:account-group-outline` |
| 租户管理 | `OfficeBuilding` | <Icon icon="mdi:domain" /> | `mdi:domain` |
| 设置管理 | `Setting` | <Icon icon="mdi:cog-outline" /> | `mdi:cog-outline` |

---

## 五、性能说明

Iconify 的 SVG 图标通过 **Iconify API CDN** 按需加载，首次使用时发起 HTTP 请求获取 SVG 数据，之后由浏览器缓存。所有图标均经 SVG 优化（移除冗余属性），平均单图标 < 1KB。

离线场景可配置本地 SVG 预设（参考 [Iconify 离线文档](https://iconify.design/docs/usage/offline/)）。
