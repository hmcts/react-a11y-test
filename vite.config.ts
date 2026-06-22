import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { copyFileSync, mkdirSync, existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

// Strip invisible Unicode that triggers Renovate warnings (present in upstream GOV.UK CSS)
const stripHiddenUnicode = (content: string): string =>
  content.replace(/[\u00A0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\u200B\u200C\uFEFF\u200E\u200F\u202A-\u202E\u00AD]/g, '')

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
  
  // Copy CSS file (sanitize hidden Unicode from upstream minified CSS)
  try {
    const cssSource = join(__dirname, 'node_modules/govuk-frontend/dist/govuk/govuk-frontend.min.css')
    const cssDest = join(publicDir, 'govuk-frontend.min.css')
    writeFileSync(cssDest, stripHiddenUnicode(readFileSync(cssSource, 'utf-8')))
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
    lightningcss: {
      errorRecovery: true,
    },
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
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: 'vendor', test: /node_modules\/(react|react-dom)\// },
            { name: 'router', test: /node_modules\/react-router-dom\// },
            { name: 'forms', test: /node_modules\/(react-hook-form|@hookform\/resolvers|zod)\// },
            { name: 'performance', test: /node_modules\/(react-window|react-window-infinite-loader)\// },
          ],
        },
      },
    },
    target: 'es2015',
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
