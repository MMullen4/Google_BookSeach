import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  ...(mode === 'development' && {
    server: {
      port: 3000,
      open: true,
      proxy: {
        '/graphql': { // plugs into back end
          target: 'http://localhost:3001',
          secure: false,
          changeOrigin: true
        }
      }
    }
  })
}))
