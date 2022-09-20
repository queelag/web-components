import { defineConfig } from 'astro/config'

import lit from '@astrojs/lit'
import preact from '@astrojs/preact'
import tailwind from '@astrojs/tailwind'

export default defineConfig({
  integrations: [lit(), preact(), tailwind()],
  vite: {
    optimizeDeps: {
      esbuildOptions: {
        target: 'esnext'
      }
    }
  }
})
