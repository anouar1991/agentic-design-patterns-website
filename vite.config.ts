import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { criticalCssPlugin } from './vite-plugin-critical-css'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), criticalCssPlugin()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-i18n': ['i18next', 'react-i18next'],
          'vendor-icons': ['lucide-react'],
          'vendor-syntax': ['react-syntax-highlighter'],
        },
      },
    },
  },
})
