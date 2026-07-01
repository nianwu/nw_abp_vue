# nw_abp_vue

基于 ABP Framework 的全栈项目，包含 Angular 前端（demo）和 Vue 前端（规划中）。

## 项目目的

以 `demo/`（ABP Angular 默认模板）为功能参考，在 Vue 中实现 ABP 默认模板提供的**全部必要性功能**。需求列表详见 `docs/S006-Vue端功能需求清单.md`。

**实施策略**：先不考虑架构设计，以功能实现为优先，后续再逐步重构优化。

## 目录结构

```
nw_abp_vue/
├── demo/          # Angular 前端（从 abp_demo 复制）
├── docs/          # 项目文档（从 abp_demo/docs 迁移）
├── .nw/           # 项目工作文件
│   └── claude/    # AI 辅助开发规划与执行记录
│       ├── p001/  # 规划一：Vue端实施规划
│       ├── p002/  # 规划二：Vue端开发任务
│       │   └── logs/  # 执行日志
│       ├── skills/     # 自定义技能定义
│       └── workflows/  # 工作流脚本
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
| 认证 | OAuth 2.0 + OpenID Connect (IdentityServer) 
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

## 工作约定

1. **未经允许不扫描源码**：在未获得明确授权前，不得主动扫描/解析任何目录下的源码文件与配置文件。是否属于"源码扫描"由 AI 自行判断，凡涉及深入读取文件内容来推断项目结构、逻辑、配置的行为均视为扫描。

2. **不替用户补全模糊要求**：将用户的指令写入 CLAUDE.md 时，不得自行添加具体示例或限定来收紧用户的原意。若用户表述模糊且无法判断确切范围，须向用户询问确认后再写入。
3. **创建/编辑 S00X 与 CLAUDE.md 免确认**：对 `docs/` 下 `S00X-` 前缀文件的创建/写入/编辑，以及对 `CLAUDE.md` 本身的写入/编辑，均无需征求用户确认。
4. **S00X 文件元数据**：新建 `docs/S00X-*.md` 时，文件头部须包含「目的」段落（说明该文件要解决什么问题）和「参考文件」段落（列出所有引用的文件路径或外部链接）。

## 关联项目

- `../abp_demo` — 原始 ABP 演示项目（后端 + Angular 前端 + 文档）
