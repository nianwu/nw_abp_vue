import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { fileURLToPath, URL } from 'node:url';
export default defineConfig({
    base: '/',
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
        proxy: {
            '/api': {
                target: 'https://localhost:44356',
                changeOrigin: true,
                secure: false,
            },
        },
    },
});
