import { build } from 'esbuild'
import { minifyHTMLLiteralsPlugin } from 'esbuild-plugin-minify-html-literals'
import { glob } from 'glob'

/** @type {import('esbuild').BuildOptions} */
const OPTIONS = {
  logLevel: 'info',
  minify: true,
  plugins: [minifyHTMLLiteralsPlugin()]
}

/**
 * ESM
 */
build({
  ...OPTIONS,
  entryPoints: await glob('./src/**/*.ts'),
  format: 'esm',
  outdir: 'dist',
  packages: 'external',
  platform: 'neutral'
}).catch(() => process.exit(1))

/**
 * CJS
 */
build({
  ...OPTIONS,
  bundle: true,
  entryPoints: ['src/index.ts'],
  external: ['@aracna/core', '@aracna/web', '@floating-ui/dom', 'dompurify', 'focus-trap', 'tabbable'],
  format: 'cjs',
  outfile: 'dist/index.cjs',
  platform: 'neutral',
  treeShaking: true
}).catch(() => process.exit(1))

/**
 * IIFE
 */
build({
  ...OPTIONS,
  bundle: true,
  entryPoints: ['src/index.ts'],
  external: ['node-fetch'],
  format: 'iife',
  outfile: 'dist/index.iife.js',
  platform: 'browser',
  treeShaking: true
}).catch(() => process.exit(1))

/**
 * ELEMENTS
 */
for (let element of await glob('./src/elements/**/*.ts')) {
  /**
   * CJS
   */
  build({
    ...OPTIONS,
    bundle: true,
    entryPoints: [element],
    external: ['@aracna/core', '@aracna/web', '@floating-ui/dom', 'dompurify', 'focus-trap', 'tabbable'],
    format: 'cjs',
    outfile: element.replace('src', 'dist').replace('.ts', '.cjs'),
    platform: 'neutral',
    treeShaking: true
  }).catch(() => process.exit(1))
}
