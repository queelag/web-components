import { nodeResolve } from '@rollup/plugin-node-resolve'
import strip from '@rollup/plugin-strip'
import typescript from '@rollup/plugin-typescript'
import { readdirSync } from 'fs'
import { defineConfig } from 'rollup'
import minifyHTML from 'rollup-plugin-minify-html-literals'
import { terser } from 'rollup-plugin-terser'

const EXTERNAL = ['@floating-ui/dom', '@aracna/core', '@aracna/web', 'dompurify', 'focus-trap', 'lit', 'lit-html', 'tabbable']
const INPUT = 'src/index.ts'
const PLUGINS = [minifyHTML.default(), strip({ include: ['src/**/*.ts'], functions: ['[a-zA-Z]+Logger.(verbose|debug|info)'] }), terser(), typescript()]

const ELEMENTS = readdirSync('src/elements').reduce(
  (elements, folder) => [...elements, ...readdirSync(`src/elements/${folder}`).map((name) => `src/elements/${folder}/${name}`)],
  []
)

export default [
  defineConfig({
    external: [
      ...EXTERNAL,
      'lit/directives/choose.js',
      'lit/directives/if-defined.js',
      'lit/directives/map.js',
      'lit/directives/style-map.js',
      'lit/directives/unsafe-svg.js',
      'lit/directives/until.js',
      'lit/directives/when.js'
    ],
    input: INPUT,
    output: {
      dir: 'dist',
      preserveModules: true,
      preserveModulesRoot: 'src',
      format: 'esm'
    },
    plugins: PLUGINS
  }),
  defineConfig({
    external: EXTERNAL,
    input: INPUT,
    output: {
      file: 'dist/index.cjs',
      format: 'cjs'
    },
    plugins: [...PLUGINS, nodeResolve()]
  }),
  ...ELEMENTS.map((input) =>
    defineConfig({
      external: EXTERNAL,
      input: input,
      output: {
        file: input.replace('src', 'dist').replace('.ts', '.cjs'),
        format: 'cjs'
      },
      plugins: [...PLUGINS, nodeResolve()]
    })
  )
]
