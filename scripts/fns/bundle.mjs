import { getPascalCaseString } from '@aracna/core'
import { build } from 'esbuild'
import { minifyHTMLLiteralsPlugin } from 'esbuild-plugin-minify-html-literals'
import { glob } from 'glob'
import { basename, extname } from 'path'

/** @type {import('esbuild').BuildOptions} */
const options = {
  logLevel: 'info',
  minify: true,
  plugins: [minifyHTMLLiteralsPlugin()]
}

export async function bundle() {
  await Promise.all(
    [
      /**
       * ESM
       */
      build({
        ...options,
        entryPoints: await glob('./src/**/*.ts'),
        format: 'esm',
        outdir: 'dist',
        packages: 'external',
        platform: 'neutral'
      }),
      /**
       * CJS
       */
      build({
        ...options,
        bundle: true,
        entryPoints: ['src/index.ts'],
        format: 'cjs',
        outfile: 'dist/index.cjs',
        packages: 'external',
        platform: 'neutral'
      }),
      /**
       * IIFE
       */
      build({
        ...options,
        bundle: true,
        entryPoints: ['src/index.ts'],
        format: 'iife',
        globalName: 'AracnaWebComponents',
        outfile: 'dist/index.iife.js',
        platform: 'browser',
        treeShaking: true
      })
    ]
      /**
       * Elements
       */
      .concat(
        (await glob('./src/elements/**/*.ts')).map((element) =>
          Promise.all([
            /**
             * CJS
             */
            build({
              ...options,
              bundle: true,
              entryPoints: [element],
              format: 'cjs',
              outfile: element.replace('src', 'dist').replace('.ts', '.cjs'),
              packages: 'external',
              platform: 'neutral'
            }),
            /**
             * IIFE
             */
            build({
              ...options,
              bundle: true,
              entryPoints: [element],
              format: 'iife',
              globalName: 'AracnaWebComponents' + getPascalCaseString(basename(element).replace(extname(element), '')),
              outfile: element.replace('src', 'dist').replace('.ts', '.iife.js'),
              platform: 'browser',
              treeShaking: true
            })
          ])
        )
      )
  ).catch(() => process.exit(1))
}
