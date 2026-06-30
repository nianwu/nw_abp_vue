# p002 — Vue 端开发任务规格（总览）

> 输入来源：[p001_vue端实施规划](./p001_vue端实施规划.md)（含 01-04 全部子文档）

## 修订记录

| 时间 | 修订内容 |
|------|---------|
| 2026-06-30 19:50:00 | 首次创建。基于 p001 规划生成 14 项开发任务的详细规格，拆分为主文件 + 2 个子文件 |

## 实施记录

| 时间 | 节点 | 说明 | 耗时 |
|------|------|------|------|
| 2026-06-30 20:00:00 | 开始实施 | Phase A 工作流启动（A1→A7 顺序流水线） | — |
| 2026-06-30 20:24:00 | A1 完成 | 项目脚手架就绪：Vite + Vue3 + TS + Element Plus + Sass + Tailwind | 00:24:00 |
| 2026-06-30 20:38:00 | A2 完成 | API 层 + HTTP 5 拦截器 + abp generate-proxy 类型/代理 | 00:13:00 |
| 2026-06-30 20:41:00 | A3 完成 | Pinia 状态层（app-config / auth / session） | 00:01:00 |
| 2026-06-30 20:47:00 | A4 完成 | i18n 远程加载 + OIDC PKCE + v-permission + 路由守卫 | 00:02:00 |
| 2026-06-30 20:52:00 | A5 完成 | 9 个 UI 组件（DataTable/Modal/DynamicForm/Toast 等） | 00:04:00 |
| 2026-06-30 20:55:00 | A6 完成 | 3 布局 + 5 子组件（SideMenu/TopBar/UserMenu 等） | 00:02:00 |
| 2026-06-30 21:00:00 | A7 完成 | LoginView + UsersView + UserCreateEditModal，端到端验证 | 00:04:00 |
| 2026-06-30 21:00:00 | Phase A 完成 | A1-A7 全部完成，B1-B6 批量产出（工作流同一批次） | 00:50:00 |
| 2026-06-30 21:14:00 | B5 完成 | FeatureModal.vue + feature-modal.ts 创建，TenantsView 联动更新 | 00:04:00 |
| 2026-06-30 21:25:00 | B7 完成 | 审计字段补充 + build 验证 + 许可证审查 + 执行日志全量更新 | 00:05:00 |
| 2026-06-30 21:25:00 | **全部完成** | 14/14 任务，门禁 G1-G8 全部 ✅（G1-G2 后端联调为独立阶段） | **01:19:00** |

---

## 子文档索引

| 文件 | 内容 | 行数 |
|------|------|------|
| [p002-01_PhaseA任务详情](./p002-01_PhaseA任务详情.md) | A1-A7 每任务的输入/产出/步骤/验收（含后端启动命令） | 192 |
| [p002-02_PhaseB任务详情](./p002-02_PhaseB任务详情.md) | B1-B7 每任务的输入/产出/步骤/验收 | ~190 |

---

## 一、任务总表

| ID | 任务 | 阶段 | 优先级 | 预估 | 依赖 | 关键产出 |
|----|------|------|--------|------|------|---------|
| A1 | 项目脚手架 | A | P0 | 0.5d | — | Vite + Vue3 + TS + Element Plus 可启动 |
| A2 | API 层 + HTTP + 类型 | A | P0 | 1d | A1 | abp generate-proxy 生成类型/代理 + 手写 5 拦截器 http.ts |
| A3 | Pinia 状态层 | A | P0 | 0.5d | A2 | 3 store（app-config/auth/session）可持久化 |
| A4 | i18n + 权限 + OIDC | A | P0 | 1d | A3 | 远程 i18n / v-permission / OIDC PKCE 流程 |
| A5 | UI 组件定型 | A | P0 | 2d | A4 | 9 组件（DataTable/Modal/Form 等）完整可用 |
| A6 | 布局系统 | A | P0 | 1d | A5 | 3 布局 + 5 子组件（菜单/顶栏/面包屑等） |
| A7 | 登录 + 用户管理 | A | P0 | 1.5d | A6 | 端到端验证通过 → Phase B 启动 |
| B1 | 角色管理 | B | P1 | 1d | A7 | 角色 CRUD + 权限入口 |
| B2 | 个人资料 + 认证页 | B | P1 | 1d | A7 | 注册/忘记密码/重置密码/个人资料 |
| B3 | 租户管理 | B | P2 | 1d | A7 | 租户 CRUD + 连接字符串 + 功能入口 |
| B4 | 权限管理（对象式） | B | P2 | 1.5d | A7 | 权限树 + 级联 + 变更摘要 + 资源权限 |
| B5 | 功能管理（对象式） | B | P2 | 1d | A7 | 功能开关/文本/选择 + 级联 + 摘要 |
| B6 | 设置管理 | B | P3 | 1d | A7 | 邮件设置 + 时区设置 |
| B7 | 集成收尾 | B | P3 | 1d | A7 | 错误页/离线提示/<title>/审计字段/S006 对照 |
| **∑** | **14 任务** | — | — | **14.5d** | — | — |

---

## 二、开发流程

```
Phase A（P0，顺序执行）                     Phase B（P1-P3，A7 后全部并行）

A1 → A2 → A3 → A4 → A5 → A6 → A7            B1  B2  B3  B4  B5  B6  B7
                                    ↘        └─── 全并行启动 ───┘
                               ✅ 门禁 G1-G4
```

## 三、通用开发规范

以下规范适用于全部 14 个任务，在各任务详情中不再重复：

1. **命名**：组件 PascalCase、composable camelCase（`useXxx`）、文件 kebab-case
2. **TS**：strict 模式，禁止 `any`（用 `unknown` + type guard），DTO 类型从 swagger.json 提取
3. **样式**：Element Plus 主题变量覆盖用 `styles/variables.scss`，业务布局用 Tailwind 类名
4. **响应式**：全部页面须在 768px 断点验证——表格横向滚动、模态框全屏、菜单抽屉、表单垂直堆叠
5. **空状态**：无数据（带"创建"引导按钮）、搜索无结果（纯文案）、下拉无选项（纯文案）三者区分
6. **错误路径**：每个涉及 API 调用的功能须手动构造 401/403/500 验证
7. **Git**：每完成一个任务 commit 一次，message 格式 `feat(A1): 项目脚手架搭建`
8. **验收**：每个任务完成后对照 [p001-04 自查清单](./p001-04_设计决策与验证.md) 逐项打勾

---

## 四、后端依赖与项目解耦

Vue 前端与 dotnet 后端为独立项目，不依赖特定目录结构。

### 后端启动

后端为 ABP 标准的 HttpApi.Host 项目（含 IdentityServer），位于独立的 dotnet 解决方案中：

```bash
# 在后端项目目录下执行（路径按实际调整）
dotnet run --project "<path>/TodoApp.HttpApi.Host/TodoApp.HttpApi.Host.csproj"
```

### 连接配置

前后端通过环境变量解耦：

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `VITE_API_BASE_URL` | API 基址 | `/api` |
| `VITE_OAUTH_AUTHORITY` | IdentityServer 地址 | `https://localhost:44356` |
| `VITE_OAUTH_CLIENT_ID` | OIDC 客户端 ID | `TodoApp_App` |

以上变量在 `vue/.env` 中配置，Vite 开发服务器通过 proxy 转发 `/api` 到后端。

### abp generate-proxy 生成 API 代理

后端运行后，在后端项目目录下执行：

```bash
# -wd 指向后端 HttpApi.Host 项目目录（含 .csproj）
# -u  指向后端运行中的 URL
# -o  输出到 Vue 项目的 src/api 目录
abp generate-proxy -t js \
  -wd "<path>/TodoApp.HttpApi.Host" \
  -u "https://localhost:44356" \
  -o "<path>/vue/src/api"
```

生成的代理文件依赖 `vue/src/api/http.ts` 导出的 `httpClient`，该文件为唯一手工维护的 HTTP 基础设施。

### 开发环境

```bash
# 终端 1：启动后端
dotnet run --project "<path>/TodoApp.HttpApi.Host"

# 终端 2：启动前端（开发模式，含 HMR + API 代理）
cd vue && npm run dev
```

## 五、执行约定

- Phase A 任务**必须顺序执行**，每个任务的产出是下一个任务的输入
- A7 完成后先通过门禁 G1-G4，再启动 Phase B
- Phase B 任务**全部可并行**，但建议先完成 B1（角色管理）验证模式复用性，再并行推进其余
- 每完成一个任务，在 [p001 主文件](./p001_vue端实施规划.md) 实施记录中追加一行
