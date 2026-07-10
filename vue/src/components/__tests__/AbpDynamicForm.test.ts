/**
 * AbpDynamicForm 组件单元测试
 */
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import ElementPlus from 'element-plus'
import AbpDynamicForm from '@/components/AbpDynamicForm.vue'
import type { AbpFormItem } from '@/types/abp'

function mountForm(props: { fields: AbpFormItem[]; modelValue?: Record<string, unknown>; cols?: number; fieldErrors?: Record<string, string[]> }) {
  return mount(AbpDynamicForm, {
    props: { modelValue: {}, ...props },
    global: { plugins: [ElementPlus] },
  })
}

describe('AbpDynamicForm', () => {
  const textField: AbpFormItem = { name: 'userName', type: 'text', label: '用户名' }
  const emailField: AbpFormItem = { name: 'email', type: 'email', label: '邮箱', required: true }
  const numberField: AbpFormItem = { name: 'age', type: 'number', label: '年龄' }
  const readOnlyField: AbpFormItem = { name: 'id', type: 'text', label: 'ID', readonly: true }

  it('渲染 text 类型字段', () => {
    const wrapper = mountForm({ fields: [textField] })
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('渲染多个字段类型', () => {
    const wrapper = mountForm({ fields: [textField, emailField, numberField] })
    expect(wrapper.findAll('.el-form-item').length).toBe(3)
  })

  it('form label 文字渲染', () => {
    const wrapper = mountForm({ fields: [emailField] })
    expect(wrapper.text()).toContain('邮箱')
  })

  it('cols=2 显示 grid CSS 类', () => {
    const wrapper = mountForm({ fields: [textField, emailField], cols: 2 })
    expect(wrapper.find('div[class*="grid-cols"]').exists()).toBe(true)
  })

  it('readonly 字段有 readonly 属性', () => {
    const wrapper = mountForm({ fields: [readOnlyField] })
    expect(wrapper.find('input').element.hasAttribute('readonly')).toBe(true)
  })

  it('输入更新触发 update:modelValue', async () => {
    const wrapper = mountForm({ fields: [textField], modelValue: { userName: '' } })
    await wrapper.find('input').setValue('张三')
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    const lastVal = (emitted! as any).at(-1)[0]
    expect(lastVal.userName).toBe('张三')
  })

  it('fieldErrors 传入 prop，组件不报错', () => {
    const wrapper = mountForm({
      fields: [textField],
      modelValue: { userName: '' },
      fieldErrors: { userName: ['用户名已存在'] },
    })
    expect(wrapper.vm).toBeTruthy()
  })
})
