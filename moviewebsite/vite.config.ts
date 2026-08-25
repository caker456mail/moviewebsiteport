import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
 server: {
  proxy: {
    // '.do'로 끝나는 모든 요청을 8080으로 전달
    '^/.*\\.do$': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
  },
}
});