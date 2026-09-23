import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Adjust '/chat' to match your endpoint structure (e.g., '/api')
      '/chat': {
        target: 'http://localhost:3000', // Replace with your backend port
        changeOrigin: true,
        secure: false,
      },
    },
  },
})