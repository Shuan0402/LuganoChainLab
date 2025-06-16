// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/LuganoChainLab', // ⚠️ 這裡請改成你的 repo 名稱
  plugins: [react()],
})
