import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { copyFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const serviceRoutes = [
  'services/residential-relocation',
  'services/corporate-shifting-service',
  'services/office-relocation',
  'services/door-to-door-relocation',
  'services/international-relocation',
  'services/car-shifting-by-car-carrier',
  'services/industrial-relocation',
  'services/air-freight',
  'services/sea-freight',
  'services/road-freight',
]

function githubPagesSpa() {
  return {
    name: 'github-pages-spa',
    closeBundle() {
      try {
        const distDir = resolve(__dirname, 'dist')
        const indexHtml = resolve(distDir, 'index.html')

        // 1. Create 404.html for any unmapped route fallback
        copyFileSync(indexHtml, resolve(distDir, '404.html'))

        // 2. Pre-generate directory index.html and route.html for all 10 service routes
        for (const route of serviceRoutes) {
          const targetDir = resolve(distDir, route)
          mkdirSync(targetDir, { recursive: true })
          copyFileSync(indexHtml, resolve(targetDir, 'index.html'))
          copyFileSync(indexHtml, resolve(distDir, `${route}.html`))
        }
      } catch (err) {
        console.error('Failed to generate GitHub Pages SPA fallbacks:', err)
      }
    },
  }
}

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
    githubPagesSpa(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
    },
  },
})
