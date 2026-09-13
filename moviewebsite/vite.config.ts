import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: '/', 

  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      // 1. 기존 .do 요청 프록시
      '^/.*\\.do$': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      // 2. 👈 /api로 시작하는 REST API 요청도 8080으로 전달 추가!
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});