import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueI18n from '@intlify/vite-plugin-vue-i18n'
import { resolve } from 'path'
const srcPath = resolve(__dirname, 'src', 'styles', 'variables.scss')

// https://vitejs.dev/config/
export default defineConfig({
  alias: {
    'vue-i18n': 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js',
  },
  plugins: [
    vue(),
    vueI18n({
      // if you want to use Vue I18n Legacy API, you need to set `compositionOnly: false`
      // compositionOnly: false,
      defaultSFCLang: 'json',
      // you need to set i18n resource including paths !
      include: resolve(__dirname, './src/i18n/*.json'),
    }),
  ],
  css: {
    preprocessorOptions: {
      sass: { additionalData: `@import ${srcPath}\n` },
      scss: { additionalData: `@import ${srcPath};\n` },
    },
  },
  build: {
    outDir: '../../../../backup/node_modules/@femike/swagger-protect/ui/dist',
    sourcemap: false,
  },
  /* remove the need to specify .vue files https://vitejs.dev/config/#resolve-extensions
  resolve: {
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ]
  },
  */
})
