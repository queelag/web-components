import { getPascalCaseString } from '@aracna/core'
import { build } from 'esbuild'
import { minifyHTMLLiteralsPlugin } from 'esbuild-plugin-minify-html-literals'
import { rm } from 'fs/promises'
import { glob } from 'glob'
import { basename, extname } from 'path'

/** @type {import('esbuild').BuildOptions} */
const OPTIONS = {
  logLevel: 'info',
  minify: true,
  plugins: [minifyHTMLLiteralsPlugin()]
}

await rm('dist', { force: true, recursive: true })

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
  external: ['@aracna/core', '@aracna/web', '@floating-ui/dom', 'dompurify', 'focus-trap', 'qrcode', 'tabbable'],
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
  format: 'iife',
  globalName: 'AracnaWebComponents',
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
    external: ['@aracna/core', '@aracna/web', '@floating-ui/dom', 'dompurify', 'focus-trap', 'qrcode', 'tabbable'],
    format: 'cjs',
    outfile: element.replace('src', 'dist').replace('.ts', '.cjs'),
    platform: 'neutral',
    treeShaking: true
  }).catch(() => process.exit(1))

  /**
   * IIFE
   */
  build({
    ...OPTIONS,
    bundle: true,
    entryPoints: [element],
    format: 'iife',
    globalName: 'AracnaWebComponents' + getPascalCaseString(basename(element).replace(extname(element), '')),
    outfile: element.replace('src', 'dist').replace('.ts', '.iife.js'),
    platform: 'browser',
    treeShaking: true
  }).catch(() => process.exit(1))
}
