import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  // 저장소 이름으로 base 설정
  base: '/moviewebsiteport/', 

  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '^/.*\\.do$': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});