<template>
  <div class="resource-key-doc">
    <h2 class="text-lg font-semibold mb-2">资源密钥说明</h2>
    <el-divider />

    <div class="prose">
      <!-- ======================== 概念 ======================== -->
      <h3>什么是资源密钥？</h3>
      <p>
        资源密钥（Resource Key）是<strong>基于 ID 的授权系统中的实体唯一标识符</strong>。
        在基于功能的授权中，你只需要知道权限名（如 "AbpIdentity.Users"）；
        在基于 ID 的授权中，你还必须指明<strong>对哪一个实体</strong>授权——这就是资源密钥的作用。
      </p>

      <el-alert title="对比" type="info" :closable="false" show-icon class="mt-3 mb-3">
        <p class="!mt-0">
          <strong>基于功能</strong>："用户 A 有 <code>用户管理</code> 权限"<br />
          <strong>基于 ID</strong>："用户 A 对 <code>用户 u1</code> 拥有 <code>读写</code> 权限"
        </p>
      </el-alert>

      <!-- ======================== 基于功能的授权 ======================== -->
      <h3>一、基于功能的授权</h3>
      <p>
        基于功能的授权通过<strong>权限策略名（Policy Name）</strong>来标识。
        策略名是一个字符串，如 <code>AbpIdentity.Users</code>，代表一个具体的功能点。
      </p>

      <el-table :data="funcFlow" size="small" border class="mt-3 mb-4">
        <el-table-column prop="step" label="步骤" width="80" />
        <el-table-column prop="action" label="操作" />
        <el-table-column prop="key" label="使用的 Key" />
      </el-table>
      <p>
        基于功能的授权<strong>不涉及实体 ID</strong>——只要用户拥有策略权限，
        就能对<strong>所有</strong>符合条件的实体执行操作。
      </p>

      <!-- ======================== 基于 ID 的授权 ======================== -->
      <h3>二、基于 ID 的授权</h3>
      <p>
        基于 ID 的授权通过<strong>资源类型 + 资源密钥 + 权限级别</strong>三元组来标识。
        资源密钥在这里扮演的是"实体 ID"的角色。
      </p>

      <h4>不同类型对应的资源密钥</h4>
      <el-table :data="examples" size="small" border class="mt-3 mb-4">
        <el-table-column prop="type" label="资源类型" width="240" />
        <el-table-column prop="key" label="资源密钥示例" />
        <el-table-column prop="desc" label="密钥含义" min-width="180" />
      </el-table>

      <h4>搜索资源密钥</h4>
      <p>在"添加资源权限"流程中，输入关键字搜索目标实体：</p>
      <ul>
        <li><strong>用户</strong>：按用户名搜索，结果返回用户 GUID</li>
        <li><strong>角色</strong>：按角色名搜索，结果返回角色 GUID</li>
        <li><strong>租户</strong>：按租户名搜索，结果返回租户 GUID</li>
      </ul>
      <p>系统内部使用 GUID 作为资源密钥的核心原因是：名称可变更，但 GUID 不可变，确保授权关系始终有效。</p>

      <!-- ======================== 两种 Key 对比 ======================== -->
      <h3>两种 Key 对比</h3>
      <el-table :data="comparison" size="small" border class="mt-3 mb-4">
        <el-table-column prop="aspect" label="" width="140" />
        <el-table-column prop="func" label="基于功能" />
        <el-table-column prop="id" label="基于 ID" />
      </el-table>

      <!-- ======================== Provider Key ======================== -->
      <h3>Provider Key 的含义</h3>
      <p>
        Provider Key 是 ABP 内部对<strong>"授权来源的标识"</strong>，与资源密钥是不同概念：
      </p>
      <ul>
        <li><strong>资源密钥</strong> → 被授权的资源（目标）</li>
        <li><strong>Provider Key</strong> → 授权的来源（谁获得了授权）</li>
      </ul>
      <table class="contrast-table mt-3 mb-4">
        <thead><tr><th>Provider</th><th>含义</th><th>Key 示例</th></tr></thead>
        <tbody>
          <tr>
            <td><el-tag type="primary" size="small">Role</el-tag></td>
            <td>授权来源是<strong>角色</strong></td>
            <td><code>admin</code>（角色名）</td>
          </tr>
          <tr>
            <td><el-tag type="success" size="small">User</el-tag></td>
            <td>授权来源是<strong>用户</strong></td>
            <td><code>u1</code>（用户 GUID）</td>
          </tr>
          <tr>
            <td><el-tag type="warning" size="small">Tenant</el-tag></td>
            <td>授权来源是<strong>租户</strong></td>
            <td><code>t1</code>（租户 GUID）</td>
          </tr>
        </tbody>
      </table>

      <el-alert title="一句话总结" type="info" :closable="false" show-icon class="mt-4">
        基于功能的授权用<strong>策略名</strong>作为 Key，基于 ID 的授权用<strong>实体 GUID</strong>作为 Key。前者回答"能做什么"，后者回答"能对谁做"。
      </el-alert>
    </div>
  </div>
</template>

<script setup lang="ts">
const funcFlow = [
  { step: '1', action: '定义权限策略', key: 'AbpIdentity.Users（策略名）' },
  { step: '2', action: '授予角色', key: 'admin（角色名）' },
  { step: '3', action: '用户继承权限', key: '—（通过角色间接获得）' },
]

const examples = [
  { type: 'Identity.Users（用户）', key: 'u1, u2, ...', desc: '用户 GUID，标识特定用户' },
  { type: 'Identity.Roles（角色）', key: 'r1, r2, ...', desc: '角色 GUID，标识特定角色' },
  { type: 'TenantManagement.Tenants（租户）', key: 't1, t2, ...', desc: '租户 GUID，标识特定租户' },
]

const comparison = [
  { aspect: 'Key 类型', func: '策略名（Policy Name）', id: '实体 GUID' },
  { aspect: 'Key 示例', func: 'AbpIdentity.Users', id: 'u1（用户 ID）' },
  { aspect: '唯一性', func: '编译时确定，全局唯一', id: '运行时生成，每个实体唯一' },
  { aspect: '可读性', func: '高（语义化命名）', id: '低（无意义 GUID）' },
  { aspect: '变更风险', func: '低（策略名很少改动）', id: '无（GUID 永不变化）' },
]
</script>

<style scoped>
.resource-key-doc {
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

.prose p,
.prose li {
  font-size: 14px;
  line-height: 1.7;
  color: var(--el-text-color-regular);
}

.prose ul {
  padding-left: 20px;
}

.contrast-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.contrast-table th, .contrast-table td {
  border: 1px solid var(--el-border-color);
  padding: 8px 12px;
}
.contrast-table th {
  background: var(--el-fill-color-light);
  font-weight: 600;
}
</style>
