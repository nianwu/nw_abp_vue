<template>
  <el-form ref="formRef" :model="formValues" label-position="top" @submit.prevent>
    <template v-for="field in fields" :key="field.name">
      <el-form-item :label="field.label" :required="field.required"
        :error="fieldErrors?.[field.name]?.[0]" :validate-status="fieldErrors?.[field.name] ? 'error' : undefined">
        <!-- text -->
        <el-input v-if="field.type === 'text'" v-model="(formValues as any)[field.name]"
          :placeholder="field.placeholder" :readonly="field.readonly" />
        <!-- number -->
        <el-input-number v-else-if="field.type === 'number'" v-model="(formValues as any)[field.name]"
          :placeholder="field.placeholder" :readonly="field.readonly" :controls="true" />
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
import { reactive, watch } from 'vue'
import type { AbpFormItem } from '@/types/abp'

const props = defineProps<{ fields: AbpFormItem[]; modelValue: Record<string, unknown>; fieldErrors?: Record<string, string[]> }>()

const emit = defineEmits<{ 'update:modelValue': [v: Record<string, unknown>] }>()

const formValues = reactive<Record<string, unknown>>({ ...props.modelValue })

watch(() => props.modelValue, (v) => {
  Object.keys(v).forEach((k) => { formValues[k] = v[k] })
})

watch(formValues, (v) => emit('update:modelValue', { ...v }), { deep: true })
</script>
