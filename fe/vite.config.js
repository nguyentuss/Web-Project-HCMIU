import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  const isDevelopment = mode === 'development';
  
  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: [{ find: "@", replacement: resolve(__dirname, "./src") }],
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            utils: ['axios', 'zustand']
          }
        }
      }
    },
    preview: {
      host: '0.0.0.0',
      port: 5173,
    },
    server: {
      host: '0.0.0.0', // Allows external access (needed for Docker)
      port: 5173, // Default Vite port
      watch: {
        usePolling: true, // Useful for Docker filesystem watching
        interval: 1000,
      },
      allowedHosts: [
        'netflex.id.vn', 
        'localhost', 
      ],
      hmr: isDevelopment ? {
        port: 5173,
        host: 'localhost',
      } : false, // Disable HMR in production
    },
  }
})