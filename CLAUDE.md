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

## 编码范式

> AI 在增删代码时，优先模仿本节所述的已有模式，保持一致性。

### Vue 组件

- 所有 `.vue` 文件使用 `<script setup lang="ts">` + Composition API
- 全局 API（`ref`、`computed`、`watch` 等）已自动导入，**不要手动写** `import { ref } from 'vue'`
- Element Plus 组件已全局注册，模板中直接写 `<el-button>`，**不要手动 import**
- 组件 props 应使用 `defineProps<T>()` 泛型语法定义类型
- 参考文件：`src/slices/identity/views/UsersView.vue`

### Slice 切片结构

每个业务切片遵循统一模式：

```
slices/<name>/
├── index.ts           # 统一 re-export 出口
├── stores/            # Pinia store（可选）
├── composables/       # 组合函数（可选）
├── views/             # 页面组件
│   └── components/    # 页面私有子组件
└── utils/             # 切片内部工具（可选）
```

- `index.ts` 只做 re-export，不包含业务逻辑
- 对外暴露清晰的公开接口（见 JSDoc 示例）
- 参考文件：`src/slices/config/index.ts`

### Store（Pinia）

- Store 文件位于各 slice 的 `stores/` 或 `src/stores/` 目录
- 使用 Pinia `defineStore` + `pinia-plugin-persistedstate` 持久化
- 通过 `@/slices/<name>` 从切片索引导入
- Store 内避免顶层 import 其他 Pinia store（会导致循环依赖），改用函数内动态 `import()`
- 参考文件：`src/slices/core/stores/auth-store.ts`

### API 调用

- API 客户端是单个 Axios 实例，导出为 `httpClient`
- 5 个拦截器按序注入：Token → Tenant → Language → Timezone → Error（见 `src/api/http.ts` 注释）
- 各资源的 API 封装放在 `src/api/` 下，如 `identity-users.ts`、`settings.ts`
- 拦截器内需要访问 store 时，使用动态 `import()` 而非顶层导入，避免循环依赖
- 参考文件：`src/api/http.ts`、`src/api/identity-users.ts`

### Provider 双模式

- 外部依赖通过 Provider 抽象层接入，编译时根据 `VITE_PROVIDER_MODE` 选择实现
- standalone 模式：数据存 localStorage，种子数据初始化
- remote 模式：通过 Vite proxy 转发到后端
- 业务代码无需感知模式差异，统一导入 `import { providers } from '@/providers'`
- 参考文件：`src/providers/index.ts`

### 路径别名

- `@/` → `src/`（`tsconfig.json` 和 `vite.config.ts` 均已配置）
- 始终使用 `@/` 别名导入，避免相对路径 `../../../`

### 类型定义

- 类型文件位于 `src/types/`，按领域命名（`abp.ts`、`identity.ts`、`tenant.ts` 等）
- 通用 ABP 类型定义（`PagedResultDto`、`ListResultDto` 等）在 `src/types/api.ts`
- `components.d.ts` 和 `auto-imports.d.ts` 由插件自动生成，**不要手动编辑**

### 注释风格

- 每个文件的顶部应有 JSDoc 说明其职责
- 复杂逻辑和关键入口（如 `main.ts` 的启动流程）需要分段注释
- 已有代码的注释密度和风格应被新代码模仿

### 日志

执行任务过程中如需记录日志，写入 `.nw/claude/p002/logs/` 目录。

## 关联项目

- `../abp_demo` — 原始 ABP 演示项目（后端 + Angular 前端 + 文档）
