/**
 * 离线检测 composable
 *
 * 监控浏览器在线状态 (navigator.onLine) + Axios 请求超时，
 * 当检测到网络不可达或请求超时时给出 Toast 提示。
 */
import { ref } from 'vue';
import { showWarning, showError } from '@/components/AbpToast';
import httpClient from '@/api/http';
const isOffline = ref(!navigator.onLine);
let onlineHandler = null;
let offlineHandler = null;
let timeoutInterceptorId = null;
export function useOffline() {
    /** 是否当前处于离线状态 */
    function checkNow() {
        isOffline.value = !navigator.onLine;
        return isOffline.value;
    }
    /** 启动监听 */
    function start() {
        // 浏览器在线状态监听
        onlineHandler = () => {
            isOffline.value = false;
            showWarning('网络已恢复');
        };
        offlineHandler = () => {
            isOffline.value = true;
            showError('网络连接已断开，部分功能不可用');
        };
        window.addEventListener('online', onlineHandler);
        window.addEventListener('offline', offlineHandler);
        // Axios 响应拦截器 — 超时 / 网络错误提示
        timeoutInterceptorId = httpClient.interceptors.response.use((response) => response, (error) => {
            if (error.code === 'ECONNABORTED') {
                showError('请求超时，请检查网络后重试');
            }
            else if (!navigator.onLine || error.message === 'Network Error') {
                isOffline.value = true;
                showError('网络连接已断开，部分功能不可用');
            }
            return Promise.reject(error);
        });
    }
    /** 停止监听 */
    function stop() {
        if (onlineHandler)
            window.removeEventListener('online', onlineHandler);
        if (offlineHandler)
            window.removeEventListener('offline', offlineHandler);
        if (timeoutInterceptorId !== null) {
            httpClient.interceptors.response.eject(timeoutInterceptorId);
        }
        onlineHandler = null;
        offlineHandler = null;
        timeoutInterceptorId = null;
    }
    return { isOffline, checkNow, start, stop };
}
