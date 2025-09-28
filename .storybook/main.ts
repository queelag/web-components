import type { StorybookConfig } from '@storybook/web-components-vite'

const config: StorybookConfig = {
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-vitest'],
  framework: {
    name: '@storybook/web-components-vite',
    options: {}
  },
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)']
}

export default config
