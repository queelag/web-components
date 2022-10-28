import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      exclude: ['src/index.ts'],
      include: ['src/**/*.ts']
    },
    environment: 'jsdom',
    globals: true,
    include: ['tests/**/*.test.ts'],
    setupFiles: [
      'vitest/stubs/get.bounding.client.rect.stub.ts',
      'vitest/stubs/resize.observer.stub.ts',
      'vitest/stubs/scroll.to.stub.ts',
      'vitest/stubs/touch.stub.ts'
    ]
  }
})
