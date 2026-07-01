/// <reference types="vite/client" />

declare const __BUILD_TIME__: string

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

declare module 'nprogress' {
  const nprogress: {
    start(): void
    done(): void
    configure(options: Record<string, unknown>): void
  }
  export default nprogress
}
