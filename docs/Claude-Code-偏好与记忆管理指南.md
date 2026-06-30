# S008-Claude-Code-偏好与记忆管理指南

## 目的

本文档整理 Claude Code 中 CLAUDE.md 与 Memory 两种持久化机制的区别、层级结构及操作方法，作为使用参考。

## 参考文件

- `C:\Users\12621\.claude\CLAUDE.md`
- `D:\proj\nw_abp_vue\CLAUDE.md`

---

## 一、两种机制：CLAUDE.md 与 Memory

Claude Code 提供两种持久化方式来跨会话保留信息：

| | **CLAUDE.md** | **Memory** |
|---|---|---|
| **本质** | 指令文件（类似 System Prompt） | 结构化记忆库（类似便签本） |
| **维护者** | 用户手动编辑 | AI 自动创建和维护 |
| **加载时机** | 每次会话开始时**完整**注入 | 会话开始时注入索引摘要，相关内容按需回忆 |
| **内容形式** | 自由 Markdown，可长篇 | 单一事实，结构化 frontmatter + 正文 |
| **关联能力** | 无 | 支持 `[[name]]` 实现跨记忆链接 |
| **Token 影响** | 始终占用上下文窗口 | 仅在相关时才占用 |
| **适合存什么** | 行为规范、工作约定、技术栈说明 | 离散偏好、历史决策、外部参考链接 |

---

## 二、两个层级：全局 vs 项目

两种机制各有两个作用范围：

```
C:\Users\<用户名>\.claude\
│
├── CLAUDE.md                    ← 全局指令（所有项目生效）
│
├── memory\                      ← 全局 Memory（所有项目生效）
│   ├── MEMORY.md                ← 索引文件
│   └── some-fact.md             ← 单条记忆
│
└── projects\
    └── <项目-slug>\
        └── memory\              ← 项目 Memory（仅本项目生效）
            ├── MEMORY.md
            └── another-fact.md

D:\proj\<项目名>\
└── CLAUDE.md                    ← 项目指令（仅本项目生效）
```

| | 全局 | 项目 |
|---|---|---|
| **CLAUDE.md** | `~\.claude\CLAUDE.md` | `.\CLAUDE.md`（项目根目录） |
| **Memory** | `~\.claude\memory\` | `~\.claude\projects\<slug>\memory\` |

### 加载情况

| 文件 | 自动加载？ | 作用范围 |
|------|-----------|---------|
| `~\.claude\CLAUDE.md` | ✅ 每次会话 | 全局 |
| `.\CLAUDE.md` | ✅ 每次会话 | 项目 |
| `~\.claude\projects\<slug>\memory\` | ✅ 自动加载 | 项目 |
| `~\.claude\memory\` | ❌ 不自动加载 | — |

> ⚠️ 跨项目偏好应写入 `~\.claude\CLAUDE.md`，全局 Memory 目录当前不会在会话中自动加载。

---

## 三、Memory 文件格式

每条记忆一个 `.md` 文件，包含 frontmatter 和正文：

```markdown
---
name: <短横线命名的-slug>
description: <一句话摘要，用于判断相关性>
metadata:
  type: user | feedback | project | reference
---

<记忆正文>

**Why:** <为什么这个信息重要>
**How to apply:** <如何应用这个信息>

相关记忆：[[other-memory-name]]
```

### 四种类型

| 类型 | 用途 | 示例 |
|------|------|------|
| `user` | 用户身份、技能、偏好 | "用户是全栈开发者，偏好 TypeScript" |
| `feedback` | 用户给出的纠正或指导 | "不要使用 any 类型" |
| `project` | 项目背景、目标、约束 | "Vue 前端需对标 demo/ 的功能" |
| `reference` | 外部资源链接 | "设计稿：https://figma.com/xxx" |

### 索引文件

`MEMORY.md` 仅包含链接列表，**不存实际内容**：

```markdown
- [文件路径前后空格](file-path-spacing.md) — 输出中文件路径前后各留一个空格
```

---

## 四、操作方法

### 4.1 管理 CLAUDE.md

| 操作 | 方法 |
|------|------|
| 编辑全局指令 | 在终端执行 `/memory`，选择 `~\.claude\CLAUDE.md` |
| 编辑项目指令 | 在项目目录下执行 `/memory`，或直接编辑 `.\CLAUDE.md` |
| 通过对话修改 | 直接对 AI 说"把 xxx 加到 CLAUDE.md" |

### 4.2 管理 Memory

| 操作 | 方法 |
|------|------|
| 记住某事 | 直接对 AI 说"记住：xxx" |
| 查看记忆 | AI 在需要时自动回忆 |
| 更新/删除 | 告诉 AI 即可，自动合并或清理 |

> Memory 文件由 AI 自动维护，用户**不需要手动编辑**。

### 4.3 选择存放位置

```
你要存的内容
    │
    ├── 每次都要遵守的行为规则？
    │   └── 写 CLAUDE.md（全局 or 项目）
    │
    ├── 项目结构/技术栈说明？
    │   └── 写 .\CLAUDE.md
    │
    └── 离散的事实/偏好/决策？
        └── 告诉 AI，AI 存 Memory（项目级）
```

---

## 五、当前状态

| 文件 | 内容 | 状态 |
|------|------|------|
| `~\.claude\CLAUDE.md` | 文件路径输出格式规则 | ✅ 生效中 |
| `~\.claude\memory\` | 已清理 | 🗑️ 已删除 |
| `.\CLAUDE.md` | 项目说明、技术栈、工作约定 | ✅ 生效中 |
| 项目 Memory | 空 | 待填充 |

---

## 六、一句话总结

> CLAUDE.md 是宪法（用户写），Memory 是便签（AI 记）。全局的管理在 `~\.claude\` 下，项目级的管理在项目目录下。日常只需用自然语言告诉 AI"记住 xxx"或"把 xxx 写入 CLAUDE.md"即可。
