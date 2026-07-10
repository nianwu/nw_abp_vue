/**
 * AbpEmptyState 组件单元测试
 */
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import ElementPlus from 'element-plus'
import AbpEmptyState from '@/components/AbpEmptyState.vue'

function mountComponent(props = {}) {
  return mount(AbpEmptyState, {
    props,
    global: { plugins: [ElementPlus] },
  })
}

describe('AbpEmptyState', () => {
  it('type="empty" 显示"暂无数据"', () => {
    const wrapper = mountComponent({ type: 'empty' })
    expect(wrapper.text()).toContain('暂无数据')
  })

  it('type="no-results" 显示"未找到匹配结果"', () => {
    const wrapper = mountComponent({ type: 'no-results' })
    expect(wrapper.text()).toContain('未找到匹配结果')
  })

  it('type="no-options" 显示"暂无可用选项"', () => {
    const wrapper = mountComponent({ type: 'no-options' })
    expect(wrapper.text()).toContain('暂无可用选项')
  })

  it('不传 type 默认显示"暂无数据"', () => {
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('暂无数据')
  })

  it('传 createLabel 渲染创建按钮', () => {
    const wrapper = mountComponent({ type: 'empty', createLabel: '新建用户' })
    const btn = wrapper.find('.el-button')
    expect(btn.exists()).toBe(true)
    expect(btn.text()).toBe('新建用户')
  })

  it('点击创建按钮触发 create 事件', async () => {
    const wrapper = mountComponent({ type: 'empty', createLabel: '新建' })
    await wrapper.find('.el-button').trigger('click')
    expect(wrapper.emitted('create')).toBeTruthy()
  })

  it('no-results 类型不渲染创建按钮', () => {
    const wrapper = mountComponent({ type: 'no-results', createLabel: '新建' })
    const btn = wrapper.find('.el-button')
    expect(btn.exists()).toBe(false)
  })
})
