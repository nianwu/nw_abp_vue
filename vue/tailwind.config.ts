import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{vue,ts,js}'],
  corePlugins: {
    preflight: false, // 与 Element Plus 冲突
  },
  theme: {
    screens: {
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
    },
    extend: {},
  },
} satisfies Config
