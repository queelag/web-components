const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./playground/src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant('aria-expanded', '["aria-expanded"="true"]&')
    })
  ]
}
