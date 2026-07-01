/**
 * 应用引导 — mount 前完成全部基础设施初始化
 *
 * 顺序: Pinia → i18n → Config → Auth → HTTP 拦截器 → Router → Mount
 *
 * 所有外部依赖通过 Provider 抽象层接入：
 *   设置 VITE_PROVIDER_MODE=standalone → 独立模式（解耦接口依赖，快速开发迭代）
 *   设置 VITE_PROVIDER_MODE=remote     → 联调模式（后端 API + OIDC）
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'
import { i18n, providers } from './providers'
import { useAppConfigStore } from './stores/app-config'
import { vPermission } from './directives/v-permission'
import './styles/index.scss'

async function bootstrap() {
  const app = createApp(App)

  // 1. Pinia + 持久化
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)
  app.use(pinia)

  // 2. i18n — 加载翻译资源
  app.use(i18n)
  await providers.i18n.loadMessages('zh-Hans')

  // 3. 应用配置 — 获取后写入 Pinia store 供全局使用
  const appConfig = useAppConfigStore()
  const config = await providers.config.fetchConfig()
  appConfig.$patch({ config: config as any })

  // 4. 认证 — 静默恢复登录态
  await providers.auth.trySilentLogin()

  // 5. 基础设施 — local 模式注册 HTTP 拦截器，remote 模式为 no-op
  await providers.setupInfrastructure()

  // 6. Element Plus + Router
  app.use(ElementPlus, { locale: zhCn })
  app.use(router)

  // 7. 全局指令
  app.directive('permission', vPermission)

  // 8. 挂载
  app.mount('#app')
}

bootstrap()
