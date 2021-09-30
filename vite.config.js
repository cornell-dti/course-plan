import * as path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  server: { port: 8080 },
  plugins: [vue()],
});
