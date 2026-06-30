<template>
  <el-form ref="formRef" :model="formValues" :rules="formRules" label-position="top" @submit.prevent>
    <template v-for="field in fields" :key="field.name">
      <el-form-item :label="field.label" :required="field.required" :prop="field.name"
        :error="fieldErrors?.[field.name]?.[0]" :validate-status="fieldErrors?.[field.name] ? 'error' : undefined">
        <!-- text -->
        <el-input v-if="field.type === 'text'" v-model="(formValues as any)[field.name]"
          :placeholder="field.placeholder" :readonly="field.readonly" />
        <!-- number -->
        <el-input-number v-else-if="field.type === 'number'" v-model="(formValues as any)[field.name]"
          :placeholder="field.placeholder" :readonly="field.readonly" :controls="true" class="w-full" />
        <!-- email -->
        <el-input v-else-if="field.type === 'email'" v-model="(formValues as any)[field.name]"
          type="email" :placeholder="field.placeholder" :readonly="field.readonly" />
        <!-- password -->
        <el-input v-else-if="field.type === 'password'" v-model="(formValues as any)[field.name]"
          type="password" show-password :placeholder="field.placeholder" />
        <!-- switch -->
        <el-switch v-else-if="field.type === 'switch'" v-model="(formValues as any)[field.name]" />
        <!-- select -->
        <el-select v-else-if="field.type === 'select'" v-model="(formValues as any)[field.name]"
          :placeholder="field.placeholder" class="w-full">
          <el-option v-for="opt in field.options" :key="String(opt.value)"
            :label="opt.label" :value="opt.value" />
        </el-select>
        <!-- date -->
        <el-date-picker v-else-if="field.type === 'date'" v-model="(formValues as any)[field.name]"
          type="date" :placeholder="field.placeholder" class="w-full" value-format="YYYY-MM-DD" />
        <!-- textarea -->
        <el-input v-else-if="field.type === 'textarea'" v-model="(formValues as any)[field.name]"
          type="textarea" :rows="3" :placeholder="field.placeholder" />
      </el-form-item>
    </template>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import type { FormRules } from 'element-plus'
import type { AbpFormItem } from '@/types/abp'

const props = defineProps<{ fields: AbpFormItem[]; modelValue: Record<string, unknown>; fieldErrors?: Record<string, string[]> }>()

const emit = defineEmits<{ 'update:modelValue': [v: Record<string, unknown>] }>()

const formRef = ref()

const formValues = reactive<Record<string, unknown>>({})

// 根据 fields 自动生成 Element Plus 校验规则
const formRules = computed<FormRules>(() => {
  const rules: FormRules = {}
  for (const f of props.fields) {
    const fieldRules: any[] = []
    if (f.required) {
      fieldRules.push({ required: true, message: `${f.label}不能为空`, trigger: 'blur' })
    }
    if (f.type === 'email') {
      fieldRules.push({ type: 'email', message: '邮箱格式不正确', trigger: 'blur' })
    }
    if (fieldRules.length) rules[f.name] = fieldRules
  }
  return rules
})

// 暴露 validate 方法供父组件调用
async function validate() {
  if (!formRef.value) return true
  return formRef.value.validate().catch(() => false)
}

defineExpose({ validate })

// 同步外部 modelValue → 内部 formValues
watch(() => props.modelValue, (v) => {
  if (!v) return
  for (const k of Object.keys(formValues)) {
    if (!(k in v)) delete formValues[k]
  }
  for (const k of Object.keys(v)) {
    formValues[k] = v[k]
  }
}, { immediate: true, deep: true })

watch(formValues, (v) => emit('update:modelValue', { ...v }), { deep: true })
</script>
