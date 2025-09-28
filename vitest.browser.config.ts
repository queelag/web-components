/// <reference types="@vitest/browser/providers/webdriverio" />

import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      instances: [{ browser: 'firefox', headless: true }],
      provider: 'webdriverio'
    },
    include: ['tests/elements/**/*.test.ts']
  }
})
