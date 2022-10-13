import { esbuildPlugin } from '@web/dev-server-esbuild'

export default {
  files: ['tests/elements/**/*.test.ts'],
  plugins: [esbuildPlugin({ ts: true })]
}
