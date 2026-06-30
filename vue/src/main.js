/**
 * 应用引导 — mount 前完成全部基础设施初始化
 *
 * 顺序: Pinia → i18n → Config → OIDC → Router → Mount
 */
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue';
import router from './router';
import i18n, { loadLocaleMessages } from './plugins/i18n';
import { useAppConfigStore } from './stores/app-config';
import { useSessionStore } from './stores/session';
import { useAuth } from './composables/useAuth';
import { vPermission } from './directives/v-permission';
import './styles/index.scss';
async function bootstrap() {
    const app = createApp(App);
    // 1. Pinia + 持久化
    const pinia = createPinia();
    pinia.use(piniaPluginPersistedstate);
    app.use(pinia);
    // 2. i18n
    app.use(i18n);
    const session = useSessionStore();
    await loadLocaleMessages(session.language || 'zh-Hans');
    // 3. 获取应用配置
    const appConfig = useAppConfigStore();
    await appConfig.fetchConfig();
    // 4. OIDC 静默恢复
    const { trySilentLogin } = useAuth();
    await trySilentLogin();
    // 5. Element Plus + Router
    app.use(ElementPlus);
    app.use(router);
    // 6. 全局指令
    app.directive('permission', vPermission);
    // 7. 挂载
    app.mount('#app');
}
bootstrap();
