import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    proxy: {
      '/api/iss-now': {
        target: 'https://api.open-notify.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/iss-now/, '/iss-now.json')
      },
      '/api/astros': {
        target: 'https://api.open-notify.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/astros/, '/astros.json')
      }
    }
  }
})