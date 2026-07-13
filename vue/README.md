# nw-abp-vue

基于 ABP Framework 的全栈 Vue 3 前端，以 ABP Angular 默认模板为功能参考，实现 ABP 默认模板提供的全部必要性功能。

## 快速开始

```bash
# 安装依赖
npm install

# 独立模式（无需后端，localStorage 模拟数据）
npm run dev

# 联调模式（连接后端 API + OIDC）
npm run dev:remote

# 构建
npm run build

# 预览构建产物
npm run preview
```

## 可用脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | standalone 模式启动开发服务器 (localhost:4200) |
| `npm run dev:remote` | remote 模式启动（需后端） |
| `npm run build` | 类型检查 + 生产构建 |
| `npm run preview` | 预览生产构建 |
| `npm run lint` | TypeScript 类型检查 |
| `npm run test:unit` | Vitest 单元测试 |
| `npm run test:watch` | 单元测试（watch 模式） |
| `npm run test:e2e` | Playwright E2E 测试 |

## 架构概览

### 切片架构

项目按业务领域拆分为切片（slice），每个切片自包含 `stores`、`composables`、`views`、`utils`：

```
src/slices/
├── config/       # 应用配置（环境变量、双模式 config provider）
├── core/         # 核心功能（认证、会话、本地化、断点响应）
├── identity/     # 用户/角色管理
├── tenant/       # 多租户管理
├── permission/   # 权限校验（v-permission 指令、usePermission、权限弹窗）
├── settings/     # 设置管理
├── feature/      # 功能管理
├── offline/      # 离线检测
├── account/      # 账户页面（注册、忘记密码、资料管理等）
└── home/         # 首页
```

### 双模式 Provider 机制

通过环境变量 `VITE_PROVIDER_MODE` 切换运行模式：

| 模式 | 值 | 数据来源 | 用途 |
|------|------|------|------|
| standalone | `VITE_PROVIDER_MODE=standalone` | localStorage + 种子数据 | 脱离后端独立开发迭代 |
| remote | `VITE_PROVIDER_MODE=remote` | 后端 API + OIDC | 联调后端 |

Provider 抽象层位于 `src/providers/`，编译时静态选择实现，无需运行时判断。

### 关键目录

```
src/
├── api/           # API 代理（Axios 请求封装）
├── components/    # 共享组件（AbpDataTable、AbpModal 等）
├── layouts/       # 布局组件
├── plugins/       # Vue 插件（i18n、OIDC）
├── providers/     # Provider 抽象层（双模式切换）
├── router/        # 路由配置
├── slices/        # 业务切片（核心架构）
├── stores/        # 全局 Store 索引
├── styles/        # 全局样式（SCSS + Tailwind）
├── types/         # TypeScript 类型定义
└── utils/         # 工具函数
```

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Vue 3.5 (Composition API + `<script setup>`) |
| 构建 | Vite 6 |
| 语言 | TypeScript 5.9 (strict) |
| UI 组件库 | Element Plus 2.11 |
| 状态管理 | Pinia 3 + persistedstate |
| 路由 | Vue Router 4 |
| 认证 | OIDC (oidc-client-ts) |
| HTTP | Axios (5 拦截器链：Token / Tenant / Language / Timezone / Error) |
| 国际化 | vue-i18n 11 |
| 表单验证 | Vee-Validate 4 + Zod |
| 样式 | SCSS + Tailwind CSS 3 |
| 图标 | Iconify + @element-plus/icons-vue |
| 测试 | Vitest (单元) + Playwright (E2E) |

## 环境变量

| 变量 | 说明 | 默认值 |
|------|------|------|
| `VITE_PROVIDER_MODE` | 运行模式 (`standalone` / `remote`) | `standalone` |
| `VITE_PROXY_TARGET` | remote 模式后端代理目标 | `https://localhost:44356` |
| `VITE_API_BASE_URL` | API 基础路径 | `/api` |
| `VITE_OAUTH_AUTHORITY` | OIDC 认证服务器地址 | `https://localhost:44356` |
| `VITE_OAUTH_CLIENT_ID` | OIDC 客户端 ID | `TodoApp_App` |
| `VITE_APP_NAME` | 应用名称 | `TodoApp` |
