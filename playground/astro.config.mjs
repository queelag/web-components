import { defineConfig } from 'astro/config'

import lit from '@astrojs/lit'
import tailwind from '@astrojs/tailwind'

export default defineConfig({
  integrations: [lit(), tailwind()],
  vite: {
    optimizeDeps: {
      esbuildOptions: {
        target: 'esnext'
      }
    }
  }
})
