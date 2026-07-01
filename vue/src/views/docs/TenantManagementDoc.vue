<template>
  <div class="tenant-doc">
    <h2 class="text-lg font-semibold mb-2">多租户管理说明</h2>
    <el-divider />

    <div class="prose">
      <!-- ======================== 概念 ======================== -->
      <h3>什么是多租户？</h3>
      <p>
        多租户（Multi-Tenancy）是一种软件架构，允许<strong>单个应用实例</strong>同时服务多个客户（租户），
        每个租户的数据和配置<strong>相互隔离</strong>。ABP Framework 从框架层面原生支持多租户。
      </p>

      <el-alert title="典型场景" type="info" :closable="false" show-icon class="mt-3 mb-3">
        <p class="!mt-0">
          <strong>SaaS 平台</strong>：一个应用服务 N 家企业客户，每家客户拥有独立数据库或数据隔离
        </p>
      </el-alert>

      <!-- ======================== 租户数据模型 ======================== -->
      <h3>一、租户数据模型</h3>

      <el-table :data="fields" size="small" border class="mt-3 mb-4">
        <el-table-column prop="field" label="字段" width="180" />
        <el-table-column prop="type" label="类型" width="100" />
        <el-table-column prop="desc" label="说明" />
      </el-table>

      <!-- ======================== 版本 ======================== -->
      <h3>二、版本（Edition）</h3>
      <p>版本决定了租户可用的功能范围，不同版本可启用不同功能模块：</p>

      <el-table :data="editions" size="small" border class="mt-3 mb-4">
        <el-table-column prop="name" label="版本" width="120" />
        <el-table-column prop="desc" label="说明" />
      </el-table>

      <el-alert title="注意" type="warning" :closable="false" show-icon class="mb-3">
        <p class="!mt-0">
          当前独立模式（standalone）仅做展示，版本切换功能待后端联调后启用。
        </p>
      </el-alert>

      <!-- ======================== 连接字符串 ======================== -->
      <h3>三、连接字符串管理</h3>
      <p>
        每个租户可拥有<strong>独立的数据库连接</strong>，ABP 的 <code>IConnectionStringResolver</code>
        会根据当前租户自动解析正确的连接字符串。
      </p>

      <h4>默认连接字符串</h4>
      <p>租户的主数据库连接串，ABP 在执行数据库操作时优先使用此连接。</p>

      <h4>命名连接字符串</h4>
      <p>一个租户可有多个命名连接字符串，用于访问不同数据库：</p>

      <el-table :data="namedConns" size="small" border class="mt-3 mb-4">
        <el-table-column prop="name" label="名称" width="120" />
        <el-table-column prop="purpose" label="用途" />
      </el-table>

      <!-- ======================== 功能管理 ======================== -->
      <h3>四、租户功能管理</h3>
      <p>每个租户可单独配置功能开关，ABP 支持两级 Provider：</p>

      <el-table :data="providers" size="small" border class="mt-3 mb-4">
        <el-table-column prop="type" label="Provider 类型" width="180" />
        <el-table-column prop="desc" label="说明" />
      </el-table>

      <h4>功能级联规则</h4>
      <p>
        当父功能为 toggle 类型且处于<strong>关闭</strong>状态时，其子功能自动<strong>禁用</strong>（灰化不可操作）。
      </p>

      <div class="bg-gray-50 p-3 rounded mt-2 mb-4">
        <code>
          双因素认证 [关闭]<br />
          &nbsp;&nbsp;└─ 子功能 A &nbsp;[禁用]<br />
          &nbsp;&nbsp;└─ 子功能 B &nbsp;[禁用]
        </code>
      </div>

      <!-- ======================== 数据隔离 ======================== -->
      <h3>五、数据隔离策略</h3>

      <el-table :data="isolation" size="small" border class="mt-3 mb-4">
        <el-table-column prop="strategy" label="策略" width="160" />
        <el-table-column prop="desc" label="说明" />
      </el-table>

      <!-- ======================== 页面结构 ======================== -->
      <h3>六、Vue 端页面结构</h3>
      <div class="bg-gray-50 p-3 rounded mt-2">
        <code>
          租户管理 (/tenant-management/tenants)<br />
          ├── 租户列表 — 新建 / 编辑 / 删除 / 启用禁用<br />
          ├── 连接字符串面板 — 默认 + 命名连接字符串增删改<br />
          └── 功能管理（FeatureModal）— 按分组显示扁平表单
        </code>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const fields = [
  { field: 'id', type: 'string', desc: '租户唯一标识（如 t1、t2）' },
  { field: 'name', type: 'string', desc: '租户名称（如 AcmeCorp）' },
  { field: 'isActive', type: 'boolean', desc: '是否启用 — 禁用的租户无法登录' },
  { field: 'adminEmailAddress', type: 'string', desc: '租户管理员邮箱' },
  { field: 'editionName', type: 'string', desc: '所属版本（Enterprise / Standard / Basic）' },
  { field: 'concurrencyStamp', type: 'string', desc: '并发控制令牌（乐观锁）' },
]

const editions = [
  { name: 'Enterprise', desc: '完整功能，适合大型组织' },
  { name: 'Standard', desc: '标准功能，适合中型团队' },
  { name: 'Basic', desc: '基础功能，适合小型试用' },
]

const namedConns = [
  { name: 'Secondary', purpose: '备用数据库' },
  { name: 'Reporting', purpose: '报表数据库（读写分离）' },
  { name: 'Logging', purpose: '日志专用数据库' },
  { name: 'Audit', purpose: '审计日志数据库' },
]

const providers = [
  { type: '租户级（T）', desc: '仅影响指定租户' },
  { type: '版本级（E）', desc: '影响该版本下所有租户' },
]

const isolation = [
  { strategy: '独立数据库', desc: '每个租户一个数据库，通过连接字符串切换' },
  { strategy: '共享数据库 + TenantId', desc: '共用数据库，ABP 自动在查询中附加 TenantId 过滤' },
  { strategy: '混合模式', desc: '部分实体共享，部分实体独立' },
]
</script>

<style scoped>
.tenant-doc {
  padding: 24px;
  max-width: 960px;
  margin: 0 auto;
}

.prose h3 {
  margin-top: 28px;
  margin-bottom: 8px;
  font-size: 16px;
  font-weight: 600;
}

.prose h4 {
  margin-top: 16px;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 600;
}

.prose p {
  font-size: 14px;
  line-height: 1.7;
  color: var(--el-text-color-regular);
}
</style>
