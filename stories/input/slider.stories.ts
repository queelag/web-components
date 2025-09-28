import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import '../../src/elements/input/slider-element'
import './slider.css'

const meta: Meta = {
  title: 'Slider',
  component: 'aracna-slider',
  subcomponents: { SliderThumb: 'aracna-slider-thumb' }
}
export default meta

type Story = StoryObj

export const Primary: Story = {
  render: () => html`
    <aracna-slider>
      <aracna-slider-thumb></aracna-slider-thumb>
    </aracna-slider>
  `
}
