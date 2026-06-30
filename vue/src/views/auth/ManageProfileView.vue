<template>
  <div class="max-w-5xl">
    <h2 class="text-xl font-semibold mb-6">个人资料</h2>

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
      <el-card shadow="never">
        <template #header>
          <div class="flex items-center gap-2">
            <el-icon><User /></el-icon>
            <span class="font-medium">基本信息</span>
          </div>
        </template>
        <AbpDynamicForm
          :fields="profileFields"
          :model-value="profileForm"
          @update:model-value="profileForm = $event"
        />
        <div class="mt-4">
          <el-button type="primary" :loading="savingProfile" @click="handleUpdateProfile">保存修改</el-button>
        </div>
      </el-card>

      <el-card shadow="never">
        <template #header>
          <div class="flex items-center gap-2">
            <el-icon><Lock /></el-icon>
            <span class="font-medium">修改密码</span>
          </div>
        </template>
        <el-form ref="passwordFormRef" :model="passwordForm" :rules="passwordRules" label-position="top" @submit.prevent>
          <el-form-item label="当前密码" prop="currentPassword" required>
            <el-input v-model="passwordForm.currentPassword" type="password" show-password placeholder="请输入当前密码" />
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword" required>
            <el-input v-model="passwordForm.newPassword" type="password" show-password placeholder="请输入新密码" />
          </el-form-item>
          <el-form-item label="确认新密码" prop="confirmPassword" required>
            <el-input v-model="passwordForm.confirmPassword" type="password" show-password placeholder="请再次输入新密码" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="savingPassword" @click="handleChangePassword">修改密码</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import { getProfile, updateProfile, changePassword } from '@/api/account'
import { showSuccess, showError } from '@/components/AbpToast'
import AbpDynamicForm from '@/components/AbpDynamicForm.vue'
import type { AbpFormItem } from '@/types/abp'
import type { FormInstance, FormRules } from 'element-plus'

// ============================================================
// Profile fields definition
// ============================================================
const profileFields: AbpFormItem[] = [
  { name: 'userName', type: 'text', label: '用户名', required: true, placeholder: '请输入用户名' },
  { name: 'name', type: 'text', label: '名字', placeholder: '请输入名字' },
  { name: 'surname', type: 'text', label: '姓氏', placeholder: '请输入姓氏' },
  { name: 'email', type: 'email', label: '邮箱', required: true, placeholder: '请输入邮箱' },
  { name: 'phoneNumber', type: 'text', label: '手机号', placeholder: '请输入手机号' },
]

const profileForm = reactive<Record<string, unknown>>({
  userName: '',
  name: '',
  surname: '',
  email: '',
  phoneNumber: '',
})

const concurrencyStamp = ref<string | null>(null)
const savingProfile = ref(false)

async function loadProfile() {
  try {
    const profile = await getProfile()
    profileForm.userName = profile.userName ?? ''
    profileForm.name = profile.name ?? ''
    profileForm.surname = profile.surname ?? ''
    profileForm.email = profile.email ?? ''
    profileForm.phoneNumber = profile.phoneNumber ?? ''
    concurrencyStamp.value = profile.concurrencyStamp
  } catch (e: unknown) {
    const err = e as { abpError?: { message?: string } }
    if (err.abpError?.message) showError(err.abpError.message)
    else showError('加载个人资料失败')
  }
}

async function handleUpdateProfile() {
  savingProfile.value = true
  try {
    await updateProfile({
      userName: (profileForm.userName as string) || null,
      email: (profileForm.email as string) || null,
      name: (profileForm.name as string) || null,
      surname: (profileForm.surname as string) || null,
      phoneNumber: (profileForm.phoneNumber as string) || null,
      concurrencyStamp: concurrencyStamp.value,
      extraProperties: {},
    })
    showSuccess('个人资料已更新')
    // 重新加载以获取最新的 concurrencyStamp
    await loadProfile()
  } catch (e: unknown) {
    const err = e as { abpError?: { message?: string } }
    if (err.abpError?.message) showError(err.abpError.message)
    else showError('保存失败，请稍后重试')
  } finally {
    savingProfile.value = false
  }
}

// ============================================================
// Password change
// ============================================================
const passwordFormRef = ref<FormInstance>()

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const validateConfirmNewPassword = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
  if (value !== passwordForm.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const passwordRules = reactive<FormRules>({
  currentPassword: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    { validator: validateConfirmNewPassword, trigger: 'blur' },
  ],
})

const savingPassword = ref(false)

async function handleChangePassword() {
  if (!passwordFormRef.value) return
  const valid = await passwordFormRef.value.validate().catch(() => false)
  if (!valid) return

  savingPassword.value = true
  try {
    await changePassword({
      currentPassword: passwordForm.currentPassword || null,
      newPassword: passwordForm.newPassword,
    })
    showSuccess('密码修改成功')
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  } catch (e: unknown) {
    const err = e as { abpError?: { message?: string } }
    if (err.abpError?.message) showError(err.abpError.message)
    else showError('修改密码失败，请稍后重试')
  } finally {
    savingPassword.value = false
  }
}

// ============================================================
// Lifecycle
// ============================================================
onMounted(loadProfile)
</script>
