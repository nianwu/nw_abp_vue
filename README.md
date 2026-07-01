# nw_abp_vue

基于 [ABP Framework](https://abp.io/) 标准模板的全栈项目，使用 Vue 3 实现 ABP 默认模板提供的**全部必要性功能**。

> 本项目由 [Claude Code](https://claude.ai/code) + DeepSeek 构建，累计耗资约 ¥50+。

## 在线演示

**🔗 https://nianwu.github.io/nw_abp_vue/**

> 部署于 GitHub Pages，自动构建，每次 `master` push 即时更新。

**📦 仓库地址：https://github.com/nianwu/nw_abp_vue**

## 构建模式

项目支持两种运行模式，通过 `VITE_PROVIDER_MODE` 环境变量切换：

| 模式 | 值 | 说明 |
|------|-----|------|
| **standalone（默认）** | `standalone` | 解耦接口依赖，localStorage 持久化 + 种子数据，快速开发迭代 |
| remote | `remote` | 联调模式，需启动 ABP 后端 + IdentityServer |

```env
# vue/.env
VITE_PROVIDER_MODE=standalone
```

| 维度 | standalone | remote |
|------|-----------|--------|
| **接口依赖** | 全部由 HTTP 拦截器模拟，零网络请求 | 直连 ABP 后端 API |
| **认证** | 注入模拟 Token，跳过 OIDC | OAuth 2.0 + OIDC 完整流程 |
| **数据存储** | localStorage 本地持久化 + 种子数据 | 后端数据库 |
| **适用场景** | 快速开发迭代、前端独立演示 | 联调、生产部署 |

- 🔓 **解耦接口依赖** — 不请求任何后端 API，无 OIDC 认证服务器
- 💾 **localStorage 持久化** — 所有数据（用户、角色、租户、设置、权限）存储在浏览器本地
- 🌱 **种子数据** — 首次启动自动注入演示数据（admin 用户、默认角色、示例租户）
- 🔐 **模拟认证** — 无需登录即可体验全部功能

## 技术栈

| 类别 | 技术 | 类别 | 技术 | 类别 | 技术 |
|-----:|:-----|-----:|:-----|-----:|:-----|
| **框架** | Vue 3.5 | **语言** | TypeScript 5.9 | **构建** | Vite 6 |
| **UI 组件** | Element Plus 2 | **CSS** | Tailwind CSS 3 + SCSS | **状态管理** | Pinia 3 |
| **路由** | Vue Router 4 | **国际化** | Vue I18n 11 | **表单验证** | Vee-Validate 4 + Zod |
| **认证** | OIDC Client TS | **包管理** | npm | | |

## 项目结构

```
nw_abp_vue/
├── vue/                  # Vue 前端（主项目）
│   ├── src/
│   │   ├── api/          # API 接口层
│   │   ├── components/   # 通用组件（ABP 组件库）
│   │   ├── composables/  # 组合式函数
│   │   ├── directives/   # 全局指令（v-permission）
│   │   ├── layouts/      # 布局组件
│   │   ├── providers/    # Provider 抽象层（standalone / remote 切换）
│   │   ├── router/       # 路由配置 + 守卫
│   │   ├── stores/       # Pinia 状态管理
│   │   │   └── standalone/  # localStorage 持久化实现
│   │   ├── styles/       # 全局样式
│   │   └── views/        # 页面组件
│   └── public/           # 静态资源
├── demo/                 # Angular 前端（功能参考）
├── docs/                 # 项目文档
└── .github/workflows/    # CI/CD（自动部署到 GitHub Pages）
```

## 本地运行

```bash
cd vue
npm install

# standalone 模式（默认）— 零外部依赖，开箱即用
npm run dev                     # → http://localhost:4200

# 构建
npm run build                   # → vue/dist/（默认 history 路由）
npx vite build --mode hash      # → hash 路由（VITE_ROUTER_MODE=hash）
```

> **重置数据**：浏览器控制台执行 `localStorage.clear()` 后刷新页面，种子数据将重新注入。
>
> 切换运行模式：修改 `vue/.env` 中 `VITE_PROVIDER_MODE=remote` 并配置后端地址。

## 相关文档

| 文档 | 说明 |
|------|------|
| [TODO.md](./TODO.md) | 已实现功能清单 + 后续规划 |
| [S008-1 设计规范速查](./docs/S008-1-设计规范速查.md) | 操作列样式、命令式弹窗、时间渲染等主观设计约定 |
| [S008 设计规范全览](./docs/S008-Vue端设计规范与个性化改动.md) | 14 大类完整设计规范与组件使用说明 |
| [S006 功能需求清单](./docs/S006-Vue端功能需求清单.md) | Vue 端功能需求详细列表 |

## 开源协议

本项目采用 **GNU General Public License v3 (GPL v3)** — 传染式 copyleft 协议：

- ✅ 可自由使用、修改、分发
- ⚠️ 衍生作品**必须**以相同 GPL v3 协议开源
- ⚠️ 分发编译产物时须附带完整源代码

> 详见 [LICENSE](./LICENSE)

## 部署

项目通过 GitHub Actions 自动构建并部署到 GitHub Pages：

- **触发条件**：push 到 `master` 分支
- **构建模式**：standalone（`VITE_PROVIDER_MODE=standalone`）
- **路由模式**：Hash 模式（`VITE_ROUTER_MODE=hash`），URL 以 `#/` 分隔，无需服务端 SPA fallback
- **站点地址**：`https://nianwu.github.io/nw_abp_vue/`
