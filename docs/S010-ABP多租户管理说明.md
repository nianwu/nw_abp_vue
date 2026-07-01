# ABP 多租户管理说明

> 目的：解释 ABP Framework 中多租户（Multi-Tenancy）的概念、数据模型和功能，帮助理解 Vue 端租户管理页面的设计意图。
>
> 参考文件：
> - `vue/src/types/tenant.ts`
> - `vue/src/stores/standalone/tenant-store.ts`
> - `vue/src/views/tenant/TenantsView.vue`
> - `vue/src/views/tenant/components/ConnectionStringPanel.vue`
> - [ABP Multi-Tenancy 官方文档](https://docs.abp.io/en/abp/latest/Multi-Tenancy)

---

## 一、什么是多租户

多租户（Multi-Tenancy）是一种软件架构，允许单个应用实例同时服务多个客户（租户），每个租户的数据相互隔离。

ABP Framework 从框架层面原生支持多租户，包括：

| 层级 | 能力 |
|------|------|
| **数据隔离** | 每个租户拥有独立的数据库或共享数据库 + TenantId 过滤 |
| **功能管理** | 不同租户可启用/禁用不同的功能模块 |
| **连接字符串** | 每个租户可指定独立的数据库连接串 |
| **租户切换** | 管理员可在不同租户间切换以管理其数据 |

---

## 二、租户数据模型

### 2.1 核心字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | `string` | 租户唯一标识（如 `t1`、`t2`） |
| `name` | `string` | 租户名称（如 `AcmeCorp`） |
| `isActive` | `boolean` | 是否启用（禁用的租户无法登录） |
| `adminEmailAddress` | `string` | 租户管理员邮箱 |
| `editionName` | `string` | 所属版本（Enterprise / Standard / Basic） |
| `creationTime` | `string` | 创建时间 |
| `lastModificationTime` | `string` | 最后修改时间 |
| `concurrencyStamp` | `string` | 并发控制令牌（乐观锁） |

### 2.2 版本（Edition）

版本决定了租户可用的功能范围。典型划分：

| 版本 | 说明 |
|------|------|
| **Enterprise** | 完整功能，适合大型组织 |
| **Standard** | 标准功能，适合中型团队 |
| **Basic** | 基础功能，适合小型试用 |

> 注意：当前独立模式（standalone）仅做展示，版本切换功能待后端联调后启用。

---

## 三、连接字符串管理

每个租户可以拥有独立的数据库连接：

### 3.1 默认连接字符串

租户的主数据库连接串，对应 `Default` 连接字符串。ABP 在执行数据库操作时优先使用此连接。

```
Server=localhost;Database=AcmeCorp;Trusted_Connection=True
```

### 3.2 命名连接字符串

一个租户可以有多个命名连接字符串，用于访问不同的数据库：

| 名称 | 用途示例 |
|------|----------|
| `Secondary` | 备用数据库 |
| `Reporting` | 报表数据库（读写分离） |
| `Logging` | 日志专用数据库 |
| `Audit` | 审计日志数据库 |

> ABP 的 `IConnectionStringResolver` 会根据当前租户自动解析正确的连接字符串。

---

## 四、租户功能管理

### 4.1 概念

每个租户可以单独配置功能开关。ABP 的 Feature Management 模块支持两级 Provider：

- **租户级**（`providerName: 'T'`）：仅影响指定租户
- **版本级**（`providerName: 'E'`）：影响该版本下的所有租户

### 4.2 当前种子数据中的功能

| 功能 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| 双因素认证 | 开关 | 启用 | 是否要求用户启用两步验证 |
| 最大用户数 | 数字 | 100 | 租户允许创建的最大用户数 |
| 密码复杂度 | 下拉 | 标准 | 密码强度要求（简单/标准/复杂） |
| 允许自助注册 | 开关 | 禁用 | 是否允许用户自行注册租户 |

### 4.3 功能级联规则

当父功能为 toggle 类型且处于**关闭**状态时，其子功能自动**禁用**（灰化不可操作）。

示例：
```
双因素认证 [关闭]
  └─ 子功能 A  [禁用]
  └─ 子功能 B  [禁用]
```

---

## 五、租户切换

ABP 支持通过 **租户切换框** 在不同租户间切换：

1. 用户在顶栏选择目标租户
2. 应用以该租户身份重新加载
3. 数据查询自动过滤为该租户的数据

> 独立模式下，租户切换通过 Pinia store 模拟，切换后刷新页面数据。

---

## 六、数据隔离策略

ABP 支持三种数据隔离策略：

| 策略 | 说明 |
|------|------|
| **独立数据库** | 每个租户一个数据库，通过连接字符串切换 |
| **共享数据库 + TenantId** | 所有租户共用数据库，ABP 自动在查询中附加 `TenantId` 过滤 |
| **混合模式** | 部分实体共享，部分实体独立 |

当前种子数据演示的是**独立数据库**策略，每个租户拥有独立的连接字符串配置。

---

## 七、Vue 端页面结构

```
租户管理 (/tenants)
├── 租户列表
│   ├── 新建租户
│   ├── 编辑租户
│   ├── 删除租户
│   └── 表格列：名称 / 管理员邮箱 / 版本 / 状态 / 创建时间 / 操作
├── 连接字符串面板
│   ├── 默认连接字符串
│   └── 命名连接字符串（增/删/改）
└── 功能管理（Feature Modal）
    └── 按功能分组显示树形结构
```

---

## 八、相关文档

- [ABP Multi-Tenancy](https://docs.abp.io/en/abp/latest/Multi-Tenancy) — 官方多租户文档
- [ABP Tenant Management](https://docs.abp.io/en/abp/latest/Modules/Tenant-Management) — 官方租户管理模块
- [ABP Feature Management](https://docs.abp.io/en/abp/latest/Modules/Feature-Management) — 功能管理模块
- [[S006-Vue端功能需求清单](./S006-Vue端功能需求清单.md)] — Vue 端功能对照
