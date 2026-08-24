import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // 1. path 모듈 불러오기

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // 2. @ 경로를 ./src 로 매핑
    },
  },
})