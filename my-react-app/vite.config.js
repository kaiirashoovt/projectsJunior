import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: ['localhost', '127.0.0.1', 'kokonaihub.onrender.com']
  },
  preview: {
    allowedHosts: ['kokonaihub.onrender.com'],
    host: '0.0.0.0',
    port: process.env.PORT || 10000
  }
})
