import * as path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  server: { port: 8080 },
  plugins: [vue()],
  // Vite's default targets with Safari raised from 13.1 to 14: the Firebase SDK uses BigInt literals.
  build: { target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'] },
  css: {
    postcss: {
      plugins: [
        {
          postcssPlugin: 'internal:charset-removal',
          AtRule: {
            charset: atRule => {
              if (atRule.name === 'charset') {
                atRule.remove();
              }
            },
          },
        },
      ],
    },
  },
});
