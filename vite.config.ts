import path from 'path';

import { defineConfig, loadEnv } from 'vite';

import vue from '@vitejs/plugin-vue';

import Icons from 'unplugin-icons/vite';

const env = loadEnv('', process.cwd(), '');

const apiUrl = env?.VITE_APP_API_BASE_URL || '/api';
const apiProtocol = env?.VITE_APP_API_PROTOCOL || 'http';
const apiService = env?.VITE_APP_API_HOST || 'localhost';
const apiPort = env?.VITE_APP_API_SERVICE_PORT || '80';

import tailwind from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  plugins: [vue(), Icons({ compiler: 'vue3' })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  logLevel: 'info',
  server: {
    proxy: {
      [apiUrl]: {
        target: `${apiProtocol}://${apiService}:${apiPort}/${apiUrl}`,
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, ''),
      },
    },
    port: 8080,
  },
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@/1_app/styles/variables.scss"; 
          @import "@/1_app/styles/mixins.scss";
        `,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1024,
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo: any) => {
          let extType = assetInfo.name?.split('.').at(1);
          if (extType) {
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
              extType = 'img';
            } else if (/tiff|bmp|ttf|woff|woff2/i.test(extType)) {
              extType = 'fonts';
            }
          }
          return `${extType}/[name]-[hash][extname]`;
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
      },
    },
  },
});
