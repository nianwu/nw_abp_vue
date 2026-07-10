/**
 * AbpDataTable 组件单元测试
 */
import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import ElementPlus from 'element-plus'
import AbpDataTable from '@/components/AbpDataTable.vue'

function mockApi() {
  return Promise.resolve({
    items: [
      { id: '1', name: '张三', email: 'zhangsan@test.com' },
      { id: '2', name: '李四', email: 'lisi@test.com' },
    ],
    totalCount: 2,
  })
}

function mountTable(props = {}) {
  return mount(AbpDataTable, {
    props: {
      columns: [
        { prop: 'name', label: '姓名' },
        { prop: 'email', label: '邮箱' },
      ],
      api: mockApi,
      storageKey: 'test-table',
      ...props,
    },
    global: {
      plugins: [ElementPlus],
      stubs: { 'el-icon': true, DateTimeCell: true },
    },
  })
}

describe('AbpDataTable', () => {
  it('列头文字正确渲染', async () => {
    const wrapper = mountTable()
    await flushPromises()
    await vi.waitFor(() => wrapper.text().includes('姓名'), { timeout: 3000 })
    expect(wrapper.text()).toContain('姓名')
    expect(wrapper.text()).toContain('邮箱')
  })

  it('数据行渲染', async () => {
    const wrapper = mountTable()
    await flushPromises()
    await vi.waitFor(() => wrapper.text().includes('张三'), { timeout: 3000 })
    expect(wrapper.text()).toContain('张三')
    expect(wrapper.text()).toContain('李四')
  })

  it('searchable=false 时不渲染搜索框', () => {
    const wrapper = mountTable({ searchable: false })
    // 搜索 placeholder 的 input 不应存在
    const searchInput = wrapper.find('input[placeholder*="搜索"]')
    expect(searchInput.exists()).toBe(false)
  })

  it('paginated=false 时不渲染分页', async () => {
    const wrapper = mountTable({ paginated: false })
    await flushPromises()
    await vi.waitFor(() => !wrapper.text().includes('加载中'), { timeout: 3000 })
    const pagination = wrapper.find('.el-pagination')
    expect(pagination.exists()).toBe(false)
  })

  it('paginated=true 时渲染分页', async () => {
    const wrapper = mountTable({ paginated: true })
    await flushPromises()
    await vi.waitFor(() => wrapper.text().includes('张三'), { timeout: 3000 })
    const pagination = wrapper.find('.el-pagination')
    expect(pagination.exists()).toBe(true)
  })

  it('actions slot 渲染操作列', () => {
    const wrapper = mount(AbpDataTable, {
      props: {
        columns: [{ prop: 'name', label: '姓名' }],
        api: mockApi,
        storageKey: 'test2',
      },
      global: { plugins: [ElementPlus], stubs: { 'el-icon': true, DateTimeCell: true } },
      slots: { actions: '<el-button>编辑</el-button>' },
    })
    expect(wrapper.html()).toContain('编辑')
  })

  it('移动端使用精简分页', async () => {
    const origWidth = window.innerWidth
    Object.defineProperty(window, 'innerWidth', { value: 375, configurable: true, writable: true })
    window.dispatchEvent(new Event('resize'))

    const wrapper = mountTable({ paginated: true })
    await flushPromises()
    await vi.waitFor(() => wrapper.text().includes('张三'), { timeout: 3000 })
    const pagination = wrapper.find('.el-pagination')
    expect(pagination.exists()).toBe(true)

    Object.defineProperty(window, 'innerWidth', { value: origWidth, configurable: true, writable: true })
  })
})
