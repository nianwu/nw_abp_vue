import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { fileURLToPath, URL } from 'node:url';
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), 'VITE_');
    const isRemote = env.VITE_PROVIDER_MODE === 'remote';
    return {
        base: './',
        plugins: [
            vue(),
            AutoImport({
                resolvers: [ElementPlusResolver()],
                imports: ['vue', 'vue-router', 'pinia'],
                dts: 'src/auto-imports.d.ts',
            }),
            Components({
                resolvers: [ElementPlusResolver()],
                dts: 'src/components.d.ts',
            }),
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `@use "@/styles/variables.scss" as *;`,
                    api: 'modern-compiler',
                },
            },
        },
        server: {
            port: 4200,
            // 仅联调模式启用后端代理，standalone 模式无需后端
            ...(isRemote
                ? {
                    proxy: {
                        '/api': {
                            target: env.VITE_PROXY_TARGET || 'https://localhost:44356',
                            changeOrigin: true,
                            secure: false,
                        },
                    },
                }
                : {}),
        },
    };
});
