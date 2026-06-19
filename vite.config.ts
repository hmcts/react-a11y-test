import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { copyFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

// Copy GOV.UK Frontend assets to public directory
const copyGovukAssets = () => {
  const assetsDir = join(__dirname, 'node_modules/govuk-frontend/dist/govuk/assets')
  const publicDir = join(__dirname, 'public/assets')
  
  if (!existsSync(publicDir)) {
    mkdirSync(publicDir, { recursive: true })
  }
  
  // Copy fonts
  const fontsDir = join(publicDir, 'fonts')
  if (!existsSync(fontsDir)) {
    mkdirSync(fontsDir, { recursive: true })
  }
  
  try {
    copyFileSync(
      join(assetsDir, 'fonts/light-94a07e06a1-v2.woff2'),
      join(fontsDir, 'light-94a07e06a1-v2.woff2')
    )
    copyFileSync(
      join(assetsDir, 'fonts/bold-b542beb274-v2.woff2'),
      join(fontsDir, 'bold-b542beb274-v2.woff2')
    )
    copyFileSync(
      join(assetsDir, 'fonts/light-f591b13f7d-v2.woff'),
      join(fontsDir, 'light-f591b13f7d-v2.woff')
    )
    copyFileSync(
      join(assetsDir, 'fonts/bold-affa96571d-v2.woff'),
      join(fontsDir, 'bold-affa96571d-v2.woff')
    )
  } catch (error) {
    console.warn('Could not copy GOV.UK fonts:', error)
  }
  
  // Copy images
  const imagesDir = join(publicDir, 'images')
  if (!existsSync(imagesDir)) {
    mkdirSync(imagesDir, { recursive: true })
  }
  
  try {
    copyFileSync(
      join(assetsDir, 'images/govuk-crest.svg'),
      join(imagesDir, 'govuk-crest.svg')
    )
  } catch (error) {
    console.warn('Could not copy GOV.UK images:', error)
  }
  
  // Copy CSS file
  try {
    copyFileSync(
      join(__dirname, 'node_modules/govuk-frontend/dist/govuk/govuk-frontend.min.css'),
      join(publicDir, 'govuk-frontend.min.css')
    )
  } catch (error) {
    console.warn('Could not copy GOV.UK CSS:', error)
  }
}

// Copy assets on startup
copyGovukAssets()

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "govuk-frontend/dist/govuk/base";
        `,
        quietDeps: true,
        silenceDeprecations: ['legacy-js-api', 'import', 'global-builtin', 'color-functions', 'slash-div'],
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          performance: ['react-window', 'react-window-infinite-loader'],
        },
      },
    },
    target: 'es2015',
    minify: 'esbuild',
    sourcemap: true,
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    open: false,
  },
  preview: {
    port: 3000,
  },
})
