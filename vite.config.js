import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'GOCOS — Global Ocean Contamination',
        short_name: 'GOCOS',
        description: 'Open-source platform for PFAS and microplastics monitoring.',
        theme_color: '#051B2C',
        background_color: '#051B2C',
        display: 'standalone',
        start_url: '/dashboard',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
})
