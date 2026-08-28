import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  // Vercel 배포를 위해 루트 경로로 변경
  base: '/', 

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