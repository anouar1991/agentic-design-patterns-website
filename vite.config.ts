import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { criticalCssPlugin } from './vite-plugin-critical-css'
import viteCompression from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    criticalCssPlugin(),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024,
      filter: /\.(js|css|html|svg|json)$/i,
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 1024,
      filter: /\.(js|css|html|svg|json)$/i,
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor splits — cacheable independently
          // Note: react-i18next goes with react to avoid circular deps
          if (id.includes('node_modules/react-dom')
            || id.includes('node_modules/react-router')
            || id.includes('node_modules/react-i18next')
            || id.includes('node_modules/react/')) return 'vendor-react'
          if (id.includes('node_modules/framer-motion')) return 'vendor-motion'
          if (id.includes('node_modules/i18next')) return 'vendor-i18n'
          if (id.includes('node_modules/lucide-react')) return 'vendor-icons'
          if (id.includes('node_modules/react-syntax-highlighter')
            || id.includes('node_modules/refractor')
            || id.includes('node_modules/prismjs')) return 'vendor-syntax'

          // Data layer — large static data, changes less often than UI
          if (id.includes('/src/data/chapters')) return 'data-chapters'
          if (id.includes('/src/data/codeTerms')) return 'data-codeterms'
          if (id.includes('/src/data/')) return 'data-misc'

          // i18n locale files
          if (id.includes('/src/i18n/')) return 'app-i18n'
        },
      },
    },
  },
})
