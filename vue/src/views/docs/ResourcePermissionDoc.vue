<template>
  <div class="resource-permission-doc">
    <h2 class="text-lg font-semibold mb-2">资源权限说明</h2>
    <el-divider />

    <div class="prose">
      <!-- ======================== 总览 ======================== -->
      <h3>两种授权模型</h3>
      <p>ABP 权限系统包含两个维度的授权：</p>

      <el-table :data="models" size="small" border class="mt-3 mb-4">
        <el-table-column prop="dim" label="" width="140" />
        <el-table-column prop="func" label="基于功能的授权" />
        <el-table-column prop="id" label="基于 ID 的授权（资源权限）" />
      </el-table>
      <ul>
        <li><strong>基于功能的授权</strong>：控制用户能<em>做什么</em>——能否打开用户管理页面、能否创建角色等。</li>
        <li><strong>基于 ID 的授权</strong>：控制用户能对<em>哪个具体实体</em>操作——能否编辑用户张三、能否管理角色 admin 的权限等。</li>
      </ul>

      <el-alert title="关系" type="info" :closable="false" show-icon class="mt-3 mb-3">
        基于功能的授权是前提（先要有"用户管理"权限），基于 ID 的授权是精细化补充（只能管理指定的那几个用户）。
      </el-alert>

      <!-- ======================== 基于功能的授权 ======================== -->
      <h3>一、基于功能的授权</h3>
      <p>即 ABP 的标准权限（Permission），定义在应用代码中，代表一个功能点：</p>
      <el-table :data="funcExamples" size="small" border class="mt-3 mb-4">
        <el-table-column prop="policy" label="权限策略名" width="300" />
        <el-table-column prop="meaning" label="控制的功能" />
      </el-table>

      <h4>工作方式</h4>
      <el-steps :active="3" align-center class="mt-3 mb-4">
        <el-step title="定义" description="ABP 模块注册权限策略" />
        <el-step title="授予" description="将权限授予角色，用户通过角色继承" />
        <el-step title="校验" description="路由守卫 / 指令 / API 检查权限" />
      </el-steps>
      <ul>
        <li><strong>路由守卫</strong>：<code>meta.requiredPolicy</code> 控制页面入口</li>
        <li><strong>指令</strong>：<code>v-permission="'PolicyName'"</code> 控制 UI 元素显隐</li>
        <li><strong>后端</strong>：<code>[Authorize("PolicyName")]</code> 网关层二次校验</li>
      </ul>

      <!-- ======================== 基于 ID 的授权 ======================== -->
      <h3>二、基于 ID 的授权（资源权限）</h3>
      <p>基于功能的授权是"开关式"的——要么能管理所有用户，要么一个都不能。
      但实际业务中常有"区域管理员只能管自己区域的用户"这类需求，这就需要用<strong>资源权限</strong>。</p>

      <h4>核心概念</h4>
      <el-table :data="idConcepts" size="small" border class="mt-3 mb-4">
        <el-table-column prop="term" label="术语" width="160" />
        <el-table-column prop="desc" label="说明" />
      </el-table>

      <h4>典型场景</h4>
      <table class="scene-table mt-3 mb-4">
        <thead><tr><th>场景</th><th>基于功能</th><th>基于 ID（资源权限）</th></tr></thead>
        <tbody>
          <tr><td>总部管理员</td><td>✅ 用户管理</td><td>—（管理所有用户）</td></tr>
          <tr><td>区域经理</td><td>✅ 用户管理</td><td>仅可读写归属自己区域的用户</td></tr>
          <tr><td>项目组长</td><td>✅ 角色管理</td><td>仅可修改自己项目的角色权限</td></tr>
          <tr><td>审计员</td><td>✅ 用户管理</td><td>仅可读取（不可修改删除）</td></tr>
        </tbody>
      </table>

      <h4>操作流程</h4>
      <el-steps :active="4" align-center class="mt-3 mb-4">
        <el-step title="选择类型" description="资源类型（如用户）" />
        <el-step title="搜索实体" description="查找具体资源实例（按 ID）" />
        <el-step title="选择级别" description="勾选权限级别（只读/读写/删除）" />
        <el-step title="确认添加" description="保存资源权限授权" />
      </el-steps>

      <!-- ======================== 权限来源 ======================== -->
      <h3>权限来源</h3>
      <ul>
        <li>
          <el-tag type="primary" size="small">Role</el-tag>
          &nbsp; 通过角色继承（角色拥有某资源权限 → 角色成员自动获得）
        </li>
        <li class="mt-2">
          <el-tag type="success" size="small">User</el-tag>
          &nbsp; 直接授予用户（仅该用户拥有）
        </li>
      </ul>

      <el-alert title="提示" type="info" :closable="false" show-icon class="mt-4">
        当前 Demo 模式下资源权限数据不会持久化，仅用于演示界面交互流程。
      </el-alert>
    </div>
  </div>
</template>

<script setup lang="ts">
const models = [
  { dim: '控制粒度', func: '功能 / 模块级别', id: '实体实例级别' },
  { dim: '授权对象', func: '用户 / 角色', id: '用户/角色 + 具体实体 ID' },
  { dim: '典型场景', func: '管理员可管理所有用户', id: '区域经理仅可管理自己区域的用户' },
  { dim: '实现方式', func: 'Permission Policy（策略）', id: 'Resource Permission（资源权限）' },
]

const funcExamples = [
  { policy: 'AbpIdentity.Users', meaning: '能否访问用户管理页面' },
  { policy: 'AbpIdentity.Users.Create', meaning: '能否新建用户' },
  { policy: 'AbpIdentity.Users.Update', meaning: '能否编辑用户' },
  { policy: 'AbpIdentity.Users.Delete', meaning: '能否删除用户' },
  { policy: 'AbpIdentity.Roles', meaning: '能否访问角色管理页面' },
  { policy: 'AbpTenantManagement.Tenants', meaning: '能否访问租户管理页面' },
]

const idConcepts = [
  { term: '资源类型', desc: '定义"这是一类什么东西"——如 Identity.Users' },
  { term: '资源密钥（ID）', desc: '标识"具体是哪一个"——如用户 GUID "u1"' },
  { term: '权限级别', desc: '定义"能做哪些操作"——如只读、读写、删除' },
]
</script>

<style scoped>
.resource-permission-doc {
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

.scene-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.scene-table th, .scene-table td {
  border: 1px solid var(--el-border-color);
  padding: 8px 12px;
}
.scene-table th {
  background: var(--el-fill-color-light);
  font-weight: 600;
}
.scene-table td:first-child {
  white-space: nowrap;
}
</style>
