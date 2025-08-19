import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"
import federation from '@originjs/vite-plugin-federation'
import modules from "./modules"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    federation({
      name: 'finance',
      filename: 'financeEntry.js',
      remotes: modules,
      exposes: {
        './Routes': './src/Routes.tsx',
      },
      shared: [
        'react', 
        'react-dom', 
        'react-router-dom',
        '@reduxjs/toolkit',
        'axios',
        'react-toastify'
      ]
    })
  ],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 5001,
    strictPort: true,
    watch: {
      usePolling: true,
    },
    cors: {
      origin: ["http://localhost:80"],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["*"]
    }
  }
})
