<template>
  <div>
    <div v-if="loading" class="py-8 text-center text-gray-400">加载中...</div>

    <template v-else>
      <AbpDynamicForm v-model="formData" :fields="emailFields" :cols="2" />

      <div class="mt-6 flex gap-3">
        <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
        <el-button :disabled="!formData.defaultFromAddress" @click="showSendDialog = true">
          发送测试邮件
        </el-button>
      </div>

      <!-- Send Test Email Dialog -->
      <el-dialog v-model="showSendDialog" title="发送测试邮件" width="500px" :close-on-click-modal="false">
        <el-form :model="testEmailForm" label-position="top">
          <el-form-item label="收件人地址" required>
            <el-input v-model="testEmailForm.targetEmailAddress" placeholder="recipient@example.com" />
          </el-form-item>
          <el-form-item label="主题" required>
            <el-input v-model="testEmailForm.subject" placeholder="测试邮件主题" />
          </el-form-item>
          <el-form-item label="正文">
            <el-input v-model="testEmailForm.body" type="textarea" :rows="4" placeholder="邮件正文（可选）" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="showSendDialog = false">取消</el-button>
          <el-button type="primary" :loading="sending" @click="handleSendTestEmail">发送</el-button>
        </template>
      </el-dialog>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { AbpFormItem } from '@/types/abp'
import { showSuccess, showError } from '@/components/AbpToast'
import * as settingsApi from '@/api/settings'
import type { EmailSettingsDto, SendTestEmailInput } from '@/types/settings'

// ---- form fields ----
const emailFields: AbpFormItem[] = [
  { name: 'smtpHost', type: 'text', label: 'SMTP 主机', required: true },
  { name: 'smtpPort', type: 'number', label: 'SMTP 端口', required: true },
  { name: 'smtpUserName', type: 'text', label: 'SMTP 用户名' },
  { name: 'smtpPassword', type: 'password', label: 'SMTP 密码' },
  { name: 'smtpDomain', type: 'text', label: 'SMTP 域' },
  { name: 'smtpEnableSsl', type: 'switch', label: '启用 SSL' },
  { name: 'smtpUseDefaultCredentials', type: 'switch', label: '使用默认凭据' },
  { name: 'defaultFromAddress', type: 'email', label: '默认发件地址', required: true },
  { name: 'defaultFromDisplayName', type: 'text', label: '默认发件显示名' },
]

// ---- state ----
const loading = ref(true)
const saving = ref(false)
const sending = ref(false)
const showSendDialog = ref(false)

const formData = ref<Record<string, unknown>>({
  smtpHost: '',
  smtpPort: 25,
  smtpUserName: '',
  smtpPassword: '',
  smtpDomain: '',
  smtpEnableSsl: false,
  smtpUseDefaultCredentials: false,
  defaultFromAddress: '',
  defaultFromDisplayName: '',
})

const testEmailForm = reactive<{
  subject: string
  body: string
  targetEmailAddress: string
}>({
  subject: 'ABP 测试邮件',
  body: '',
  targetEmailAddress: '',
})

// ---- load ----
async function loadSettings() {
  loading.value = true
  try {
    const data: EmailSettingsDto = await settingsApi.getEmailSettings()
    Object.assign(formData.value, data)
  } catch {
    showError('加载邮件设置失败')
  } finally {
    loading.value = false
  }
}

onMounted(loadSettings)

// ---- save ----
async function handleSave() {
  saving.value = true
  try {
    await settingsApi.updateEmailSettings({
      smtpHost: (formData.value['smtpHost'] as string | null) ?? '',
      smtpPort: (formData.value['smtpPort'] as number) ?? 25,
      smtpUserName: (formData.value['smtpUserName'] as string | null) ?? '',
      smtpPassword: (formData.value['smtpPassword'] as string | null) ?? '',
      smtpDomain: (formData.value['smtpDomain'] as string | null) ?? '',
      smtpEnableSsl: (formData.value['smtpEnableSsl'] as boolean) ?? false,
      smtpUseDefaultCredentials: (formData.value['smtpUseDefaultCredentials'] as boolean) ?? false,
      defaultFromAddress: (formData.value['defaultFromAddress'] as string) ?? '',
      defaultFromDisplayName: (formData.value['defaultFromDisplayName'] as string) ?? '',
    })
    showSuccess('邮件设置已保存')
  } catch {
    showError('保存邮件设置失败')
  } finally {
    saving.value = false
  }
}

// ---- send test email ----
async function handleSendTestEmail() {
  const target = testEmailForm.targetEmailAddress.trim()
  const subject = testEmailForm.subject.trim()

  if (!target) {
    showError('请输入收件人地址')
    return
  }
  if (!subject) {
    showError('请输入邮件主题')
    return
  }

  const senderAddress = (formData.value['defaultFromAddress'] as string) ?? ''
  if (!senderAddress) {
    showError('请先设置默认发件地址')
    return
  }

  const input: SendTestEmailInput = {
    subject,
    body: testEmailForm.body || null,
    senderEmailAddress: senderAddress,
    targetEmailAddress: target,
  }

  sending.value = true
  try {
    await settingsApi.sendTestEmail(input)
    showSuccess('测试邮件已发送')
    showSendDialog.value = false
    testEmailForm.body = ''
    testEmailForm.targetEmailAddress = ''
    testEmailForm.subject = 'ABP 测试邮件'
  } catch {
    showError('发送测试邮件失败')
  } finally {
    sending.value = false
  }
}
</script>
