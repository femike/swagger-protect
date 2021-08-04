import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/login-api',
  build: {
    outDir: '../../../../backup/node_modules/@femike/swagger-protect/ui/dist',
  },
})
