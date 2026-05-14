import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Keep this only for LOCAL development
  server: {
    port: 5173,
  },

  // This is REQUIRED for Railway (production)
  preview: {
    host: "0.0.0.0",
    port: 8080,
    allowedHosts: [
      "empathetic-strength-production-beab.up.railway.app",
      "medicloud-production.up.railway.app"
    ]
  }
})