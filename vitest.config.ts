import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      include: ['src/utils/**/*.ts']
    },
    environment: 'jsdom',
    include: ['tests/utils/**/*.test.ts']
  }
})
