import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'VueSidebarKit',
      formats: ['es', 'cjs'],
      fileName: (format) => {
        if (format === 'es') return 'vue-sidebar-kit.js'
        if (format === 'cjs') return 'vue-sidebar-kit.cjs'
        return `vue-sidebar-kit.${format}.js`
      }
    },
    outDir: 'dist',
    sourcemap: true,
    cssCodeSplit: false,
    rollupOptions: {
      external: ['vue', 'vue-router', '@inertiajs/vue3'],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
          'vue-router': 'VueRouter',
          '@inertiajs/vue3': 'InertiaVue3'
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'style.css'
          return assetInfo.name
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
