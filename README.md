# nw_abp_vue

基于 [ABP Framework](https://abp.io/) 标准模板的全栈项目，使用 Vue 3 实现 ABP 默认模板提供的**全部必要性功能**。

## 🌐 在线演示

**🔗 https://nianwu.github.io/nw_abp_vue/**

> 部署于 GitHub Pages，自动构建，每次 `master` push 即时更新。

## 🏗️ 构建模式

项目支持两种运行模式，通过 `VITE_PROVIDER_MODE` 环境变量切换：

| 模式 | 值 | 说明 |
|------|-----|------|
| **local（默认）** | `local` | 独立运行，零外部依赖，无需后端 |
| remote | `remote` | 联调模式，需启动 ABP 后端 + IdentityServer |

```env
# vue/.env
VITE_PROVIDER_MODE=local
```

### local 模式特点

- 🚫 **零网络依赖** — 不请求任何后端 API，无 OIDC 认证服务器
- 💾 **localStorage 持久化** — 所有数据（用户、角色、租户、设置、权限）存储在浏览器本地
- 🌱 **种子数据** — 首次启动自动注入演示数据（admin 用户、默认角色、示例租户）
- 🔐 **模拟认证** — 无需登录即可体验全部功能

## ✨ 已实现功能

### 认证模块
- [x] 登录 / 注册 / 忘记密码 / 重置密码
- [x] OAuth 2.0 + OpenID Connect（remote 模式，基于 `oidc-client-ts`）
- [x] 静默 Token 刷新、Session 监控
- [x] 个人资料管理

### 身份管理
- [x] 用户 CRUD（列表、创建、编辑、删除、搜索、分页）
- [x] 角色 CRUD（含权限分配）
- [x] 权限弹窗（树形勾选，支持编辑/非编辑权限）

### 多租户
- [x] 租户 CRUD（列表、创建、编辑、删除）
- [x] 默认/非默认连接字符串配置
- [x] 租户功能开关管理

### 设置管理
- [x] 时区设置
- [x] 密码复杂度策略
- [x] 注册/登录行为配置
- [x] 账户锁定策略
- [x] 双因素认证设置

### 功能管理
- [x] 功能开关弹窗（多层级分组，支持编辑/非编辑功能）

### 基础设施
- [x] ABP Dynamic Form（动态表单渲染，支持多种字段类型）
- [x] ABP Data Table（增强表格，排序/分页/搜索/批量操作）
- [x] ABP Toast / ABP Modal / ABP Confirm Dialog
- [x] 权限指令 `v-permission`（细粒度 UI 显示控制）
- [x] 权限组合式函数 `usePermission`
- [x] 路由守卫（认证 + 权限检查）
- [x] 中文本地化（zh-Hans）
- [x] 错误页面（403 / 404 / 500）
- [x] 加载进度条（NProgress）

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Vue 3.5 |
| 语言 | TypeScript 5.9 |
| 构建 | Vite 6 |
| UI 组件 | Element Plus 2 |
| CSS | Tailwind CSS 3 + SCSS |
| 状态管理 | Pinia 3 + `pinia-plugin-persistedstate` |
| 路由 | Vue Router 4 |
| 国际化 | Vue I18n 11 |
| 表单验证 | Vee-Validate 4 + Zod |
| 认证 | OIDC Client TS（remote 模式） |
| 包管理 | npm |

## 📂 项目结构

```
nw_abp_vue/
├── vue/                  # Vue 前端（主项目）
│   ├── src/
│   │   ├── api/          # API 接口层
│   │   ├── components/   # 通用组件（ABP 组件库）
│   │   ├── composables/  # 组合式函数
│   │   ├── directives/   # 全局指令（v-permission）
│   │   ├── layouts/      # 布局组件
│   │   ├── providers/    # Provider 抽象层（local / remote 切换）
│   │   ├── router/       # 路由配置 + 守卫
│   │   ├── stores/       # Pinia 状态管理
│   │   │   └── local/    # localStorage 持久化实现
│   │   ├── styles/       # 全局样式
│   │   └── views/        # 页面组件
│   └── public/           # 静态资源（含 SPA 404 fallback）
├── demo/                 # Angular 前端（功能参考）
├── docs/                 # 项目文档
└── .github/workflows/    # CI/CD（自动部署到 GitHub Pages）
```

## 🚀 本地运行

```bash
cd vue
npm install
npm run dev        # 启动开发服务器 → http://localhost:4200
npm run build      # 构建生产版本 → vue/dist/
```

## 📦 部署

项目通过 GitHub Actions 自动构建并部署到 GitHub Pages：

- **触发条件**：push 到 `master` 分支
- **构建模式**：local（`VITE_PROVIDER_MODE=local`）
- **SPA fallback**：自定义 `404.html` 处理客户端路由刷新
- **站点地址**：`https://nianwu.github.io/nw_abp_vue/`
