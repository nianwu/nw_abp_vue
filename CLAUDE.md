# nw_abp_vue

基于 ABP Framework 的全栈项目，包含 Angular 前端（demo）和 Vue 前端（规划中）。

## 目录结构

```
nw_abp_vue/
├── demo/          # Angular 前端（从 abp_demo 复制）
├── docs/          # 项目文档（从 abp_demo/docs 迁移）
└── CLAUDE.md      # 项目说明
```

## 技术栈

### demo/ — Angular 前端

| 类别 | 技术 |
|------|------|
| 框架 | Angular ~21.2 (Standalone Components) |
| 平台 | ABP Framework ~10.4 |
| 语言 | TypeScript ~5.9 |
| UI 主题 | Lepton X (~5.4) |
| 认证 | OAuth 2.0 + OpenID Connect (IdentityServer) |
| 测试 | Vitest (单元), Protractor (E2E) |
| 构建 | esbuild (@angular/build) |
| 包管理 | Yarn |

### ABP 模块

- `@abp/ng.core` — 核心模块
- `@abp/ng.account` — 账户管理
- `@abp/ng.identity` — 用户/角色管理
- `@abp/ng.tenant-management` — 多租户管理
- `@abp/ng.setting-management` — 设置管理
- `@abp/ng.feature-management` — 功能管理
- `@abp/ng.theme.shared` / `@abp/ng.theme.lepton-x` — 主题

## 关联项目

- `../abp_demo` — 原始 ABP 演示项目（后端 + Angular 前端 + 文档）
