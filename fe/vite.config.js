import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: [{ find: "@", replacement: resolve(__dirname, "./src") }],
  },
  server: {
    host: '0.0.0.0', // Allows external access (needed for Docker)
    port: 5173, // Default Vite port
    watch: {
      usePolling: true, // Useful for Docker filesystem watching
      interval: 1000,
    },
    allowedHosts: [
      'hcmiu-project-web.id.vn', 
      'localhost', 
    ],
  },
})